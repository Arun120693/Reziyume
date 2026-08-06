"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

declare global {
  interface Window {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Razorpay: any;
  }
}

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function UpgradeClient({ country }: { country: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("upgrade_page_view");
  }, [trackEvent]);

  const features = [
    "Unlimited AI Resume Generation",
    "Unlimited Resume Parsing",
    "Premium Resume Templates",
    "Unlimited PDF Downloads",
    "Priority AI Processing",
    "Future Premium Features Included",
  ];

  const price = country === "IN" ? "₹99" : "$5";

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      setError(null);
      trackEvent("checkout_started");

      const response = await fetch("/api/payments/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    country,
  }),
});
      if (!response.ok) {
        throw new Error("Unable to start checkout. Please try again.");
      }

      const data = await response.json();
      
      if (data.provider === "stripe") {
        trackEvent("checkout_redirected", { url: data.url });
        window.location.href = data.url;
      } else if (data.provider === "razorpay") {
        const res = await loadRazorpay();
        if (!res) {
          throw new Error("Razorpay SDK failed to load. Are you offline?");
        }
        
        const options = {
          key: data.key,
          subscription_id: data.subscriptionId,
          name: "Reziyume",
          description: "Reziyume Pro",
          prefill: {
            name: data.name,
            email: data.email,
            contact: data.contact || "",
          },
          handler: async function (response: unknown) {
            try {
              // verify-razorpay endpoint handles validation and activation
              const verifyRes = await fetch("/api/payments/verify-razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              if (verifyRes.ok) {
                window.location.href = "/dashboard/payment/success";
              } else {
                setError("Payment verification failed. Please contact support.");
              }
            } catch {
              setError("Payment verification failed.");
            }
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
            },
          },
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Invalid payment provider returned.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unable to start checkout. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 sm:p-10 shadow-[20px_20px_60px_rgba(30,27,50,0.05),-10px_-10px_30px_rgba(255,255,255,0.8)] max-w-lg mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="text-[14px] uppercase tracking-wider font-extrabold text-purple-600 mb-4">
          Pro Plan
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-extrabold text-[#111111]">{price}</span>
          <span className="text-[17px] font-medium text-[#6b6880]">/month</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
            </div>
            <span className="text-[15px] font-semibold text-[#333333]">{feature}</span>
          </li>
        ))}
      </ul>

      {error && (
        <div className="p-3 mb-6 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={isLoading}
        className="w-full h-14 rounded-2xl flex items-center justify-center font-bold text-[16px] text-white transition-all disabled:opacity-70"
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
          boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating secure checkout...
          </>
        ) : (
          "Upgrade Now"
        )}
      </button>
      
      <div className="mt-4 text-center text-xs text-[#9490b0] font-medium">
        Secure payment processed by {country === "IN" ? "Razorpay" : "Stripe"}.
      </div>
    </div>
  );
}
