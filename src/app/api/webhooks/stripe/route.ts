import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    console.error("Stripe webhook verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "invoice.payment_succeeded": {
        // Activation / Renewal
        const data = event.data.object as unknown as {
          subscription?: string;
          metadata?: { userId?: string };
          subscription_details?: { metadata?: { userId?: string } };
        };
        const subscriptionId = data.subscription;
        
        let userId = data.metadata?.userId;
        if (!userId && data.subscription_details?.metadata?.userId) {
           userId = data.subscription_details.metadata.userId;
        }

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          // Only fetch user id from subscription if not available in current object
          if (!userId && subscription.metadata?.userId) {
            userId = subscription.metadata.userId;
          }

          if (userId) {
            const currentPeriodEnd = new Date(((subscription as unknown) as { current_period_end: number }).current_period_end * 1000);
            
            // Check state for idempotency: if user is FREE -> reset monthlyParseCount
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user) {
              const isActivating = user.plan === "FREE";
              
              await prisma.user.update({
                where: { id: userId },
                data: {
                  plan: "PRO",
                  stripeSubscriptionId: subscriptionId,
                  planExpiresAt: currentPeriodEnd,
                  ...(isActivating ? { monthlyParseCount: 0 } : {}),
                },
              });
            }
          }
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        // Expiration / Cancellation
        const data = event.data.object as unknown as {
          subscription?: string;
          id?: string;
          metadata?: { userId?: string };
        };
        const userId = data.metadata?.userId;
        
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: "FREE",
              // We do not clear planExpiresAt. They keep access until JIT expiration catches them.
            },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
