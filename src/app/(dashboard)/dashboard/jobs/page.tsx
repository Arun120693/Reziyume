"use client";
import { useEffect, useState } from "react";
import { jobStatuses } from "@/lib/jobApplication";
type Job = { id?: string; company: string; role: string; url: string; status: typeof jobStatuses[number]; notes: string; appliedAt: string | null };
const blank: Job = { company: "", role: "", url: "", status: "Saved", notes: "", appliedAt: null };
export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draft, setDraft] = useState<Job | null>(null);
  const [filter, setFilter] = useState("All");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    try { const r = await fetch("/api/jobs"); if (!r.ok) throw new Error("Could not load applications. Please retry."); setJobs(await r.json()); setError(""); }
    catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    fetch("/api/jobs").then(r => { if (!r.ok) throw new Error("Could not load applications. Please retry."); return r.json(); }).then(result => { if (active) setJobs(result); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function save() {
    if (!draft) return;
    setBusy(true); setError("");
    try {
      const r = await fetch(`/api/jobs${draft.id ? `/${draft.id}` : ""}`, { method: draft.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      if (!r.ok) throw new Error("Could not save. Check the details and try again.");
      setDraft(null); await load();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function remove(job: Job) {
    if (!window.confirm(`Delete the application for ${job.role} at ${job.company}?`)) return;
    setBusy(true);
    try { const r = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" }); if (!r.ok) throw new Error("Could not delete application."); await load(); }
    catch(e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-6xl p-5 md:p-10"><header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Job applications</h1><p className="mt-2 text-slate-600">Keep opportunities, interview notes, and next steps in one place.</p></div><button onClick={() => setDraft({ ...blank })} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Add application</button></header>
    {error && <p role="alert" className="my-4 text-red-700">{error} <button onClick={load}>Retry</button></p>}
    <label className="my-6 block">Status <select className="ml-2 rounded-xl border bg-white p-3" value={filter} onChange={e => setFilter(e.target.value)}>{["All", ...jobStatuses].map(s => <option key={s}>{s}</option>)}</select></label>
    {loading ? <p role="status">Loading applications…</p> : <div className="grid gap-4 lg:grid-cols-2">{jobs.filter(j => filter === "All" || j.status === filter).map(j => <article key={j.id} className="rounded-2xl border bg-white p-5"><span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-800">{j.status}</span><h2 className="mt-3 text-xl font-bold">{j.role}</h2><p>{j.company}</p>{j.appliedAt && <p className="mt-1 text-sm text-slate-500">Applied {new Date(j.appliedAt).toLocaleDateString()}</p>}<p className="my-4 whitespace-pre-wrap break-words text-sm text-slate-600">{j.notes || "No notes yet."}</p><div className="flex flex-wrap gap-4">{j.url && <a className="text-indigo-700" href={j.url} target="_blank" rel="noopener noreferrer">Job posting ↗</a>}<button disabled={busy} onClick={() => setDraft({ ...j })}>Edit / add notes</button><button disabled={busy} className="text-red-700" onClick={() => remove(j)}>Delete</button></div></article>)}</div>}
    {!loading && !jobs.length && <p className="rounded-2xl border border-dashed p-10 text-center text-slate-500">Add your first opportunity to start tracking your search.</p>}
    {draft && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Application details"><form onSubmit={e => { e.preventDefault(); save(); }} className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-auto rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">{draft.id ? "Edit application" : "New application"}</h2>{(["company", "role", "url"] as const).map(key => <label className="block capitalize" key={key}>{key === "url" ? "Job posting URL (optional)" : key}<input className="mt-1 w-full rounded-xl border p-3" type={key === "url" ? "url" : "text"} required={key !== "url"} maxLength={key === "url" ? 2000 : 200} value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })}/></label>)}<label className="block">Status<select className="ml-3 rounded-xl border p-3" value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as Job["status"] })}>{jobStatuses.map(s => <option key={s}>{s}</option>)}</select></label><label className="block">Application date<input className="ml-3 rounded-xl border p-3" type="date" value={draft.appliedAt?.slice(0, 10) || ""} onChange={e => setDraft({ ...draft, appliedAt: e.target.value ? `${e.target.value}T12:00:00.000Z` : null })}/></label><label className="block">Notes and next steps<textarea className="mt-1 w-full rounded-xl border p-3" rows={6} maxLength={20000} value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })}/></label>{error && <p role="alert" className="text-red-700">{error}</p>}<div className="flex gap-4"><button disabled={busy} className="rounded-xl bg-slate-900 px-5 py-3 text-white">{busy ? "Saving…" : "Save application"}</button><button disabled={busy} type="button" onClick={() => setDraft(null)}>Cancel</button></div></form></div>}
  </main>;
}
