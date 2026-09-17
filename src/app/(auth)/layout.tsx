import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-shell min-h-screen bg-[#faf9f6] px-5 py-10 sm:py-16 flex flex-col items-center justify-center">
    <Link href="/" className="mb-10 flex items-center gap-2 text-sm text-stone-600"><ArrowLeft size={15}/> Back to Reziyume</Link>
    <div className="w-full max-w-md">
      <div className="mb-8 text-center"><span className="inline-flex rounded-xl bg-[#294c3e] text-white p-3 mb-4"><FileText size={24}/></span><h1 className="text-3xl font-semibold tracking-tight text-[#294c3e]">Your next chapter starts here.</h1><p className="mt-3 text-sm text-stone-500">A little polish for everything you bring.</p></div>
      <div className="rounded-2xl border border-stone-200 bg-white px-6 sm:px-9 py-9 shadow-[0_16px_60px_#253d3308]">{children}</div>
    </div>
  </div>;
}
