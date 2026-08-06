import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import Razorpay from "razorpay";

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

    if (generatedSignature !== razorpay_signature) {
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

    // Update user to PRO
    const isActivating = user.plan === "FREE";
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days approx. Webhook will sync exactly if it arrives.

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: "PRO",
        razorpaySubscriptionId: razorpay_subscription_id,
        planExpiresAt: expiresAt,
        ...(isActivating ? { monthlyParseCount: 0 } : {}),
      },
    });

    console.log("✅ Synchronous verification successful. User upgraded to PRO.");

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Razorpay synchronous verification error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
