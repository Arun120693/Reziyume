"use client";
import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
const plain = (s: string) => s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export function WritingAssistant({ onClose }: { onClose: () => void }) {
  const data = useResumeStore(s => s.data)!;
  const [mode, setMode] = useState("bullet");
  const [experienceId, setExperienceId] = useState(data.experience[0]?.id || "");
  const [facts, setFacts] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function generate() {
    setBusy(true); setMessage(""); setOutput("");
    try {
      const r = await fetch("/api/writing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, facts, jobDescription }) });
      const result = await r.json(); if (!r.ok) throw new Error(result.error || "Could not generate a draft."); setOutput(result.text);
    } catch(e) { setMessage((e as Error).message); } finally { setBusy(false); }
  }
  function useFacts() {
    const experience = data.experience.find(e => e.id === experienceId);
    setFacts((mode === "bullet" && experience ? `${experience.position} at ${experience.company}\n${plain(experience.description)}` : `${data.contact.jobTitle}\n${plain(data.summary)}\n${data.experience.map(e => `${e.position} at ${e.company}: ${plain(e.description)}`).join("\n")}\nSkills: ${data.skills.map(s => s.name).join(", ")}`).slice(0, 12000));
  }
  function apply() {
    if (mode === "summary") useResumeStore.getState().updateSummary(`<p>${escape(output).replace(/\n/g, "<br>")}</p>`);
    else {
      const current = useResumeStore.getState().data?.experience.find(e => e.id === experienceId);
      if (!current) { setMessage("Choose an experience entry first."); return; }
      const bullets = output.split("\n").filter(s => s.trim()).map(s => `<li>${escape(s.replace(/^\s*[-*•]\s*/, ""))}</li>`).join("");
      useResumeStore.getState().updateExperience(experienceId, { description: current.description + `<ul>${bullets}</ul>` });
    }
    setOutput(""); setMessage("Added to your resume. Review it in the preview.");
  }
  return <div className="fixed inset-0 z-[85] grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Writing assistant"><section className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-auto rounded-3xl bg-white p-6"><header className="flex justify-between"><h2 className="text-2xl font-bold">AI writing assistant</h2><button disabled={busy} onClick={onClose}>Close</button></header><p className="text-sm text-slate-600">Draft from your own facts, then review and edit. Only the text below is sent to Google Gemini. 30 requests per day.</p><label className="block">Write<select disabled={busy} className="ml-3 rounded-xl border p-3" value={mode} onChange={e => { setMode(e.target.value); setOutput(""); }}>{[["bullet", "Experience bullets"], ["summary", "Professional summary"], ["cover-letter", "Cover letter"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>{mode === "bullet" && <label className="block">Experience entry<select disabled={busy} className="mt-1 w-full rounded-xl border p-3" value={experienceId} onChange={e => { setExperienceId(e.target.value); setOutput(""); }}><option value="">Choose an entry</option>{data.experience.map(e => <option key={e.id} value={e.id}>{e.position} — {e.company}</option>)}</select></label>}<button disabled={busy} onClick={useFacts} className="text-sm font-semibold text-indigo-700">Use relevant resume details</button><label className="block">Your facts and achievements<textarea disabled={busy} value={facts} onChange={e => setFacts(e.target.value)} rows={5} maxLength={12000} className="mt-1 w-full rounded-xl border p-3" placeholder="What did you do? Include tools, scope, and real results."/></label><label className="block">Job description (optional)<textarea disabled={busy} value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={3} maxLength={12000} className="mt-1 w-full rounded-xl border p-3"/></label><button disabled={busy || facts.trim().length < 20} onClick={generate} className="rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Writing…" : "Generate draft"}</button>{message && <p role="status">{message}</p>}{output && <div className="space-y-3 border-t pt-4"><label className="block font-semibold">Review your draft<textarea value={output} onChange={e => setOutput(e.target.value)} rows={9} className="mt-2 w-full rounded-xl border p-3 font-normal"/></label><p className="text-sm text-slate-600">Verify every claim. Keep only statements that accurately describe your experience.</p><div className="flex flex-wrap gap-3">{mode !== "cover-letter" && <button disabled={!output.trim() || (mode === "bullet" && !experienceId)} onClick={apply} className="rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-40">{mode === "summary" ? "Replace summary" : "Append bullets"}</button>}<button onClick={async () => { try { await navigator.clipboard.writeText(output); setMessage("Copied."); } catch { setMessage("Select the draft text and copy it manually."); } }}>Copy draft</button>{mode === "cover-letter" && <button onClick={() => { const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = "cover-letter.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }}>Download letter</button>}</div></div>}</section></div>;
}
