import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  console.log("========================================");
  console.log("RAZORPAY WEBHOOK RECEIVED");
  console.log("Time:", new Date().toISOString());
  console.log("========================================");

  const body = await req.text();

  console.log("Raw Body:");
  console.log(body);

  const signature = req.headers.get("X-Razorpay-Signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  console.log("Signature:", signature);
  console.log("Secret Exists:", !!secret);

  if (!signature) {
    console.error("No Razorpay signature received.");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  console.log("Expected Signature:", expectedSignature);
  console.log("Received Signature:", signature);

  if (expectedSignature !== signature) {
    console.error("❌ Razorpay webhook verification failed");
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  console.log("✅ Signature verification successful");

  const event = JSON.parse(body);

  console.log("========================================");
  console.log("Webhook Event:", event.event);
  console.dir(event, { depth: null });
  console.log("========================================");

  try {
    switch (event.event) {
      case "subscription.charged": {
        console.log("Processing subscription.charged");

        const subscription = event.payload.subscription.entity;
        const subscriptionId = subscription.id;
        const currentEnd = new Date(subscription.current_end * 1000);

        const userId = subscription.notes?.userId;

        console.log("Subscription ID:", subscriptionId);
        console.log("User ID:", userId);
        console.log("Current End:", currentEnd);

        if (userId) {
          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          console.log("User Found:", !!user);

          if (user) {
            const isActivating = user.plan === "FREE";

            await prisma.user.update({
              where: { id: userId },
              data: {
                plan: "PRO",
                razorpaySubscriptionId: subscriptionId,
                planExpiresAt: currentEnd,
                ...(isActivating ? { monthlyParseCount: 0 } : {}),
              },
            });

            console.log("✅ User upgraded to PRO");
          }
        } else {
          console.error("No userId found in subscription notes.");
        }

        break;
      }

      case "subscription.halted":
      case "subscription.cancelled": {
        console.log(`Processing ${event.event}`);

        const subscription = event.payload.subscription.entity;
        const userId = subscription.notes?.userId;

        console.log("User ID:", userId);

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: "FREE",
            },
          });

          console.log("User downgraded to FREE");
        }

        break;
      }

      default:
        console.log("Unhandled webhook event:", event.event);
    }
  } catch (err) {
    console.error("❌ Razorpay Webhook processing error:");
    console.error(err);

    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }

  console.log("Webhook processed successfully.");
  console.log("========================================");

  return NextResponse.json({ received: true });
}