"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { ResumeData } from "@/lib/types/resume";

type Check = { label: string; ok: boolean; detail: string };

export function ResumeReadiness({ data, onClose }: { data: ResumeData; onClose: () => void }) {
  const [jobDescription, setJobDescription] = useState("");
  const checks: Check[] = [
    { label: "Name", ok: Boolean(data.contact.fullName.trim()), detail: "Add your full name in Personal Details." },
    { label: "Professional title", ok: Boolean(data.contact.jobTitle.trim()), detail: "Add the role you are targeting." },
    { label: "Contact details", ok: Boolean(data.contact.email.trim() || data.contact.phone.trim()), detail: "Add an email address or phone number." },
    { label: "Professional summary", ok: data.summary.replace(/<[^>]+>/g, "").trim().length >= 40, detail: "Write a short summary of your experience and strengths." },
    { label: "Experience", ok: data.experience.length > 0, detail: "Add at least one experience entry." },
    { label: "Education", ok: data.education.length > 0, detail: "Add your education or remove this section if it is not relevant." },
    { label: "Skills", ok: data.skills.length >= 3, detail: "Add at least three relevant skills." },
  ];
  const complete = checks.filter((check) => check.ok).length;
  const searchableText = `${data.summary} ${data.experience.map((item) => `${item.position} ${item.description}`).join(" ")}`.toLowerCase();
  const matchedSkills = data.skills.filter((skill) => searchableText.includes(skill.name.toLowerCase())).length;
  const atsScore = Math.min(100, Math.round((complete / checks.length) * 70 + (data.skills.length ? (matchedSkills / data.skills.length) * 30 : 0)));
  const jobKeywords = jobDescription.toLowerCase().match(/\b[a-z][a-z0-9+#.-]{3,}\b/g) || [];
  const uniqueKeywords = [...new Set(jobKeywords)].filter((word) => !["with", "from", "that", "this", "your", "have", "will", "work"].includes(word));
  const resumeText = searchableText;
  const matchedJobKeywords = uniqueKeywords.filter((word) => resumeText.includes(word));
  const missingJobKeywords = uniqueKeywords.filter((word) => !resumeText.includes(word)).slice(0, 12);
  const overusedKeywords = [...new Set(resumeText.match(/\b[a-z][a-z0-9+#.-]{3,}\b/g) || [])].map((word) => ({ word, count: (resumeText.match(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) || []).length })).filter((item) => item.count >= 5).sort((a, b) => b.count - a.count).slice(0, 8);
  const bulletTexts = data.experience.flatMap((item) => item.description.replace(/<[^>]+>/g, "\n").split("\n")).map((item) => item.trim()).filter(Boolean);
  const bulletScore = bulletTexts.length ? Math.round(bulletTexts.reduce((sum, bullet) => sum + (/[0-9%$]/.test(bullet) ? 35 : 0) + (/\b(led|built|increased|reduced|launched|managed|improved|delivered|created|optimized)\b/i.test(bullet) ? 35 : 0) + (bullet.length >= 45 && bullet.length <= 220 ? 30 : 10), 0) / bulletTexts.length) : 0;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="readiness-title">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">ATS feedback</p><h2 id="readiness-title" className="mt-1 text-2xl font-extrabold text-slate-900">ATS Score & suggestions</h2><p className="mt-1 text-sm text-slate-500">Improve the highlighted items before you apply.</p></div>
          <button onClick={onClose} aria-label="Close readiness checklist" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-500">Readiness</p><p className="mt-1 text-xl font-extrabold text-slate-900">{complete}/{checks.length}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-500">ATS signal</p><p className="mt-1 text-xl font-extrabold text-slate-900">{atsScore}/100</p></div></div>
        <div className="mt-4"><label htmlFor="job-description" className="text-xs font-bold text-slate-700">Optional job description match</label><textarea id="job-description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste a job description to see matching keywords" className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 p-3 text-xs outline-none focus:border-pink-400" />{jobDescription && <div className="mt-3 space-y-2 text-xs"><p className="font-semibold text-emerald-700">Matched {matchedJobKeywords.length} of {uniqueKeywords.length} detected keywords.</p>{missingJobKeywords.length > 0 && <p className="text-amber-700"><strong>Missing:</strong> {missingJobKeywords.join(", ")}</p>}{overusedKeywords.length > 0 && <p className="text-slate-600"><strong>Overused:</strong> {overusedKeywords.map((item) => `${item.word} (${item.count}×)`).join(", ")}</p>}<p className="text-slate-500">Add missing terms only when they accurately describe your experience; replace repeated wording with specific results.</p></div>}</div>
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3"><p className="text-xs font-bold text-slate-700">Bullet quality score <span className="text-pink-600">{bulletScore}/100</span></p><p className="mt-1 text-xs leading-5 text-slate-500">Strong bullets use an action verb, stay focused, and show a measurable result such as a percentage, count, revenue, or time saved.</p></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-pink-500 transition-all" style={{ width: `${(complete / checks.length) * 100}%` }} /></div>
        <div className="mt-5 space-y-2">{checks.map((check) => <div key={check.label} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3"><span className={check.ok ? "text-emerald-500" : "text-amber-500"}>{check.ok ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}</span><div><p className="text-sm font-bold text-slate-800">{check.label}</p>{!check.ok && <p className="mt-0.5 text-xs text-slate-500">{check.detail}</p>}</div></div>)}</div>
        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Continue editing</button>
      </div>
    </div>
  );
}
