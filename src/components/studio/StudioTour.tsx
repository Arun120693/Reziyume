"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Image, LayoutTemplate, PenLine, Upload } from "lucide-react";

type TourStep = { title: string; body: string; icon: typeof Upload; action?: string };

const steps: TourStep[] = [
  { title: "Start with your resume", body: "Upload an existing PDF and Reziyume will fill in your sections, or enter everything yourself from the Content tab.", icon: Upload, action: "Upload Resume" },
  { title: "Add your information", body: "Use Personal Details for your name and contact information, then add Experience, Education, Skills, Projects, and custom sections.", icon: PenLine, action: "Open Content" },
  { title: "Add a profile photo", body: "For photo-compatible templates, open Content → Personal Details and use the Photo upload area. You can crop the picture before saving it to your resume.", icon: Image, action: "Open Photo details" },
  { title: "Make it yours", body: "Open Customize to choose a template, accent color, spacing, and typography. Your preview updates as you edit.", icon: LayoutTemplate, action: "Open Customize" },
  { title: "Download and share", body: "When your resume is ready, choose PDF matching preview or Text PDF, then select Download in the top-right corner.", icon: Check },
];

export function StudioTour({ onAction, onClose }: { onAction: (action?: string) => void; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;
  const finish = () => { localStorage.setItem("reziyume-studio-tour-complete", "true"); onClose(); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="studio-tour-title">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Quick tour · {step + 1}/{steps.length}</span>
          <button onClick={finish} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Skip tour</button>
        </div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600"><Icon className="h-6 w-6" /></div>
        <h2 id="studio-tour-title" className="text-2xl font-extrabold tracking-tight text-slate-900">{current.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{current.body}</p>
        <div className="mt-6 flex gap-1.5">{steps.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-pink-500" : "bg-slate-200"}`} />)}</div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 disabled:invisible"><ArrowLeft className="h-4 w-4" /> Back</button>
          <div className="flex gap-2">
            {current.action && <button onClick={() => onAction(current.action)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">{current.action}</button>}
            <button onClick={() => step === steps.length - 1 ? finish() : setStep((value) => value + 1)} className="flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{step === steps.length - 1 ? "Finish" : "Next"}<ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
