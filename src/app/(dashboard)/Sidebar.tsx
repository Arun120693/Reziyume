"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Crown, Star } from "lucide-react";
import { useUserContext } from "@/lib/context/UserContext";

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const { plan } = useUserContext();
  const isStudio = pathname?.includes("/studio/");

  if (isStudio) return null;

  return (
    <aside
      className="w-[260px] flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 glass-nav"
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #333333 0%, #111111 100%)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 10h10M4 14h12M4 18h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[17px] font-extrabold tracking-tight" style={{ color: "#111111" }}>
            Reziyume
          </span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-4" style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all"
          style={
            pathname === "/dashboard"
              ? {
                  background: "rgba(255,255,255,0.6)",
                  color: "#111111",
                  boxShadow: "4px 4px 12px rgba(180,178,195,0.5), -4px -4px 12px rgba(255,255,255,0.8)"
                }
              : { color: "#6b6880" }
          }
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
            <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
          </svg>
          Resume
        </Link>

        {/* Upgrade to Pro */}
        <Link
          href="/dashboard/upgrade"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all group"
          style={
            pathname === "/dashboard/upgrade"
              ? {
                  background: "rgba(255,255,255,0.6)",
                  color: "#111111",
                  boxShadow: "4px 4px 12px rgba(180,178,195,0.5), -4px -4px 12px rgba(255,255,255,0.8)"
                }
              : { color: "#6b6880" }
          }
        >
          {plan === "FREE" ? (
            <Crown className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          ) : (
            <Star className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          )}
          {plan === "FREE" ? "Upgrade to Pro" : "Pro Plan"}
        </Link>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-2">
        {/* Plan display */}
        <div className="px-4 pb-2 mb-2">
          <div className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: "#9490b0" }}>
            Current Plan
          </div>
          <div className="flex items-center gap-2 text-[14px] font-bold" style={{ color: "#111111" }}>
            {plan === "FREE" ? (
              <span>Free</span>
            ) : (
              <span className="flex items-center gap-1.5 text-purple-600">
                <Star className="w-3.5 h-3.5 fill-current" /> Pro
              </span>
            )}
          </div>
        </div>
        
        <div className="text-xs px-4 pb-1 truncate font-medium" style={{ color: "#9490b0" }}>
          {email}
        </div>
        <Link
          href="/api/auth/signout"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all hover:bg-white/50"
          style={{
            color: "#6b6880",
            border: "1px solid rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.2)"
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </Link>
      </div>
    </aside>
  );
}
