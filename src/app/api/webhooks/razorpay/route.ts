import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { recordPayment } from "@/lib/recordPayment";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("X-Razorpay-Signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (!signature || !/^[a-f0-9]{64}$/i.test(signature) || !crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))) return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  try {
    const event = JSON.parse(body);
    const subscription = event.payload?.subscription?.entity;
    if (event.event === "subscription.charged") {
      const payment = event.payload?.payment?.entity;
      if (!subscription?.notes?.userId || !subscription.current_end || payment?.status !== "captured") throw new Error("Incomplete payment event");
      await recordPayment({ userId: subscription.notes.userId, provider: "Razorpay", externalId: payment.id, amountMinor: Number(payment.amount), currency: payment.currency, subscriptionId: subscription.id, expiresAt: new Date(subscription.current_end * 1000) });
    } else if (["subscription.halted", "subscription.cancelled", "subscription.completed"].includes(event.event) && subscription?.notes?.userId) {
      // Cancellation stops renewal; paid access remains until its recorded expiry.
      await prisma.user.updateMany({ where: { id: subscription.notes.userId, razorpaySubscriptionId: subscription.id, planExpiresAt: { lte: new Date() } }, data: { plan: "FREE" } });
    }
    return NextResponse.json({ received: true });
  } catch {
    console.error("Razorpay webhook processing failed; provider should retry.");
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
