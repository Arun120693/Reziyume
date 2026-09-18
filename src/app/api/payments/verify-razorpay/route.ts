import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import Razorpay from "razorpay";
import { recordPayment } from "@/lib/recordPayment";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = await req.json();

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required Razorpay parameters" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not configured");
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Verify signature using Razorpay's official subscription verification algorithm
    // signature = hmac_sha256(razorpay_payment_id + "|" + razorpay_subscription_id, secret);
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (typeof razorpay_signature !== "string" || !/^[a-f0-9]{64}$/i.test(razorpay_signature) || !crypto.timingSafeEqual(Buffer.from(generatedSignature, "hex"), Buffer.from(razorpay_signature, "hex"))) {
      console.error("❌ Razorpay signature verification failed");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Fetch subscription from Razorpay to prevent replay attacks
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);

    if (
      subscription.status !== "active" &&
      subscription.status !== "created" &&
      subscription.status !== "authenticated"
    ) {
      console.error("❌ Razorpay subscription is not active. Status:", subscription.status);
      return NextResponse.json({ error: "Subscription is not active" }, { status: 400 });
    }

    // Get the authenticated user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // NEW: Ensure the subscription actually belongs to the authenticated user!
    // We embedded the userId in the notes during checkout.
    if (subscription.notes?.userId !== user.id) {
      console.error(
        "❌ Cross-account upgrade attempt! Subscription belongs to",
        subscription.notes?.userId,
        "but session belongs to",
        user.id
      );
      return NextResponse.json(
        { error: "Subscription ownership verification failed" },
        { status: 403 }
      );
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured" || !payment.invoice_id || !subscription.current_end) {
      return NextResponse.json({ error: "Payment is still processing. Your plan will update after capture." }, { status: 409 });
    }
    const invoices = await razorpay.invoices.all({ subscription_id: subscription.id, payment_id: payment.id });
    if (!invoices.items.some(invoice => invoice.id === payment.invoice_id && invoice.payment_id === payment.id)) return NextResponse.json({ error: "Payment does not match subscription" }, { status: 403 });
    await recordPayment({ userId: user.id, provider: "Razorpay", externalId: payment.id, amountMinor: Number(payment.amount), currency: payment.currency, subscriptionId: subscription.id, expiresAt: new Date(subscription.current_end * 1000) });

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Razorpay synchronous verification error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
