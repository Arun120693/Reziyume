"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div 
        className="w-full max-w-md p-10 rounded-[32px] flex flex-col items-center text-center"
        style={{
          background: "rgba(240,238,250,0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: "20px 20px 60px rgba(30,27,50,0.1), -10px -10px 30px rgba(255,255,255,0.8)"
        }}
      >
        <div 
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{
            background: "rgba(239,68,68,0.1)",
            boxShadow: "6px 6px 20px rgba(180,178,195,0.4), -6px -6px 20px rgba(255,255,255,0.85)"
          }}
        >
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-[#111111] mb-2">Payment Cancelled</h1>
        <p className="text-[15px] font-medium text-[#6b6880] mb-8">
          No charges were made to your account. You can upgrade to Reziyume Pro anytime from the studio.
        </p>

        <Link href="/dashboard" className="w-full">
          <button 
            className="neo-btn w-full py-3.5 font-bold text-[15px]" 
            style={{ color: "#111111" }}
          >
            Return to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
