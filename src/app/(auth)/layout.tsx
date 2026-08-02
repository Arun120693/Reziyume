import React from "react";
import BackgroundResumes from "./BackgroundResumes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e8e6f0 0%, #dddaed 50%, #e6e3f3 100%)" }}
    >
      {/* Neomorphic ambient blobs */}
      <div className="absolute top-[-8%] left-[-8%] w-[500px] h-[500px] rounded-full animate-blob animation-delay-2000"
        style={{ background: "radial-gradient(circle, rgba(124,111,247,0.18) 0%, transparent 70%)" }}
      />
      <div className="absolute top-[25%] right-[-10%] w-[420px] h-[420px] rounded-full animate-blob animation-delay-4000"
        style={{ background: "radial-gradient(circle, rgba(232,121,160,0.15) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-[-12%] left-[25%] w-[380px] h-[380px] rounded-full animate-blob"
        style={{ background: "radial-gradient(circle, rgba(100,180,255,0.12) 0%, transparent 70%)" }}
      />

      {/* Decorative Resume Stack */}
      <BackgroundResumes />

      {/* Brand header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center neo-raised"
            style={{ background: "linear-gradient(135deg, #333333 0%, #111111 100%)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 10h10M4 14h12M4 18h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "#111111" }}>
            Reziyume
          </h2>
          <p className="text-sm font-medium" style={{ color: "#6b6880" }}>
            Craft your professional story.
          </p>
        </div>
      </div>

      {/* Glass card form container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-10 px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
