import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e8e6f0 0%, #dddaed 40%, #e4e1f2 100%)" }}
    >
      {/* Ambient neomorphic blobs */}
      <div
        className="absolute top-[-10%] right-[-8%] w-[500px] h-[500px] rounded-full animate-blob"
        style={{ background: "radial-gradient(circle, rgba(124,111,247,0.2) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[40%] left-[-10%] w-[420px] h-[420px] rounded-full animate-blob animation-delay-2000"
        style={{ background: "radial-gradient(circle, rgba(232,121,160,0.16) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-15%] right-[20%] w-[380px] h-[380px] rounded-full animate-blob animation-delay-4000"
        style={{ background: "radial-gradient(circle, rgba(100,160,255,0.14) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <header
        className="absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10"
        style={{
          background: "rgba(235,233,245,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.5)"
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c6ff7 0%, #e879a0 100%)",
              boxShadow: "0 4px 14px rgba(124,111,247,0.45), inset 0 1px 0 rgba(255,255,255,0.3)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 10h10M4 14h12M4 18h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[17px] font-extrabold tracking-tight" style={{ color: "#2d2b3d" }}>
            ResumeForge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ color: "#6b6880" }}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="accent-btn text-sm font-semibold px-5 py-2.5 inline-flex items-center"
          >
            Sign up free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10 pt-24 pb-20">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
          style={{
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.7)",
            color: "#7c6ff7",
            boxShadow: "3px 3px 10px rgba(180,178,195,0.35), -3px -3px 10px rgba(255,255,255,0.8)"
          }}
        >
          <span>✦</span>
          100% Free. No Paywalls. No Watermarks.
        </div>

        {/* Headline */}
        <h1
          className="max-w-4xl text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          style={{ color: "#2d2b3d" }}
        >
          Craft a professional resume in{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #7c6ff7 0%, #e879a0 100%)" }}
          >
            minutes
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg sm:text-xl mb-12 leading-relaxed" style={{ color: "#6b6880" }}>
          ResumeForge is a completely free online resume builder featuring modern templates, AI writing assistance, and an intuitive drag-and-drop editor. Everything is unlocked forever.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="accent-btn inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold"
          >
            Build your resume free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl transition-all"
            style={{
              color: "#4a4760",
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.75)",
              boxShadow: "4px 4px 12px rgba(180,178,195,0.4), -4px -4px 12px rgba(255,255,255,0.85)"
            }}
          >
            Log in to dashboard
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-14">
          {["Totally Free Forever", "No Hidden Fees", "ATS-Friendly Templates", "Unlimited Downloads"].map((feat) => (
            <div
              key={feat}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.65)",
                color: "#4a4760",
                boxShadow: "2px 2px 6px rgba(180,178,195,0.3), -2px -2px 6px rgba(255,255,255,0.75)"
              }}
            >
              ✓ {feat}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
