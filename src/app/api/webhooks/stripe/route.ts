import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { recordPayment } from "@/lib/recordPayment";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });
  if (!process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
  let event;
  try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: "Verification failed" }, { status: 400 }); }
  try {
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const reference = invoice.parent?.subscription_details?.subscription;
      const subscriptionId = typeof reference === "string" ? reference : reference?.id;
      if (subscriptionId && invoice.status === "paid" && invoice.amount_paid > 0) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata.userId;
        if (!userId) throw new Error("Missing subscription owner");
        const ends = subscription.items.data.map(item => item.current_period_end);
        await recordPayment({ userId, provider: "Stripe", externalId: invoice.id, amountMinor: invoice.amount_paid, currency: invoice.currency.toUpperCase(), subscriptionId, expiresAt: new Date(Math.max(...ends) * 1000) });
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      if (subscription.metadata.userId) await prisma.user.updateMany({ where: { id: subscription.metadata.userId, stripeSubscriptionId: subscription.id, planExpiresAt: { lte: new Date() } }, data: { plan: "FREE" } });
    }
    // Checkout completion alone is not proof that an invoice was paid.
    return NextResponse.json({ received: true });
  } catch {
    console.error("Stripe webhook processing failed; provider should retry.");
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
