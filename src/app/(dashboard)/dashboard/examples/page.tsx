"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resumeExamples } from "@/lib/resumeExamples";
export default function ExamplesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function create(exampleId: string) {
    setBusy(exampleId); setError("");
    try { const r = await fetch("/api/resumes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exampleId }) }); const result = await r.json(); if (!r.ok) throw new Error(result.message || "Could not create a draft."); router.push(`/dashboard/studio/${result.resume.id}`); }
    catch(e) { setError((e as Error).message); setBusy(""); }
  }
  return <main className="mx-auto max-w-6xl p-5 md:p-10"><h1 className="text-3xl font-bold">Resume examples</h1><p className="mt-3 max-w-3xl text-slate-600">Explore structures and writing ideas by role and industry. These are fictional examples: replace every claim, skill, and employer with your own facts before applying.</p><div className="my-6 flex flex-wrap gap-3"><input className="rounded-xl border bg-white p-3" aria-label="Search roles" placeholder="Search roles or skills" value={query} onChange={e => setQuery(e.target.value)}/><select className="rounded-xl border bg-white p-3" aria-label="Industry" value={industry} onChange={e => setIndustry(e.target.value)}>{["All", ...new Set(resumeExamples.map(e => e.industry))].map(i => <option key={i}>{i}</option>)}</select></div>{error && <p role="alert" className="my-4 text-red-700">{error}</p>}<div className="grid gap-5 lg:grid-cols-2">{resumeExamples.filter(e => (industry === "All" || e.industry === industry) && `${e.role} ${e.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())).map(e => <article key={e.id} className="space-y-4 rounded-2xl border bg-white p-6"><p className="text-xs font-semibold uppercase text-indigo-700">{e.industry} · Fictional example</p><h2 className="text-xl font-bold">{e.role}</h2><p>{e.summary}</p><ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">{e.bullets.map(b => <li key={b}>{b}</li>)}</ul><p className="text-sm font-medium">Skills: {e.skills.join(" · ")}</p><p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">{e.advice}</p><button disabled={!!busy} onClick={() => create(e.id)} className="rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-50">{busy === e.id ? "Creating…" : "Create a practice draft"}</button></article>)}</div></main>;
}
