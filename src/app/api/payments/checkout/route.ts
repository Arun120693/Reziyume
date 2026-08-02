import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { razorpay } from "@/lib/razorpay";

function sanitizeRazorpayCustomerName(name: string | null | undefined): string {
  if (!name) return "Reziyume User";

  // Remove unwanted characters (keep letters, numbers, spaces, hyphen, apostrophe, period)
  let sanitized = name.replace(/[^\p{L}\d \-'\.]/gu, "");

  // Collapse multiple spaces and trim
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized || "Reziyume User";
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { country } = await req.json();

    if (country === "IN") {
      // Razorpay Subscription
      let razorpayCustomerId = user.razorpayCustomerId;

      // Create Razorpay customer if it doesn't exist
      if (!razorpayCustomerId) {
        const sanitizedName = sanitizeRazorpayCustomerName(session.user.name);

        console.log("=== RAZORPAY CUSTOMER CREATION PAYLOAD ===");
        console.log("Original Name:", session.user.name);
        console.log("Sanitized Name:", sanitizedName);
        console.log("Email:", session.user.email);
        console.log("==========================================");

        const customer = await razorpay.customers.create({
          name: sanitizedName,
          email: session.user.email,
        });

        razorpayCustomerId = customer.id;

        await prisma.user.update({
          where: { id: user.id },
          data: { razorpayCustomerId },
        });
      }

      // ==========================
      // DEBUG LOGS START
      // ==========================
      console.log("==========================================");
      console.log("CREATING RAZORPAY SUBSCRIPTION");
      console.log("Plan ID:", process.env.RAZORPAY_MONTHLY_PLAN_ID);
      console.log("Customer ID:", razorpayCustomerId);
      console.log("User ID:", user.id);
      console.log("==========================================");
      // ==========================

      // Create subscription
      const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_MONTHLY_PLAN_ID as string,
        customer_notify: 1,
        total_count: 120,
        notes: {
          userId: user.id,
        },
      });

      // ==========================
      // DEBUG LOGS START
      // ==========================
      console.log("==========================================");
      console.log("RAZORPAY SUBSCRIPTION RESPONSE");
      console.dir(subscription, { depth: null });
      console.log("==========================================");
      // ==========================

      return NextResponse.json({
        provider: "razorpay",
        subscriptionId: subscription.id,
        key: process.env.RAZORPAY_KEY_ID,
      });

    } else {
      // Stripe Subscription
      let stripeCustomerId = user.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name || "Reziyume User",
          metadata: {
            userId: user.id,
          },
        });

        stripeCustomerId = customer.id;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCustomerId,
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_MONTHLY_PRICE_ID,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
          },
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/payment/cancel`,
      });

      return NextResponse.json({
        provider: "stripe",
        url: checkoutSession.url,
      });
    }

  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("================ Payment Error [DEV] ================");
      console.error("Complete Payment Error Object:");
      console.dir(error, { depth: null });

      const devMessage =
        error?.error?.description ||
        error?.message ||
        error?.description ||
        JSON.stringify(error);

      return NextResponse.json(
        { error: devMessage },
        { status: 500 }
      );
    }

    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}