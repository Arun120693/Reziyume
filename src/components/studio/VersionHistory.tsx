"use client";
import { useEffect, useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

type Version = { id: string; label: string; createdAt: string };
export function VersionHistory({ onClose }: { onClose: () => void }) {
  const data = useResumeStore(s => s.data);
  const dirty = useResumeStore(s => s.hasUnsavedChanges);
  const [versions, setVersions] = useState<Version[]>([]);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const url = `/api/resumes/${data?.id}/versions`;
  async function load() {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not load history. Please retry.");
    setVersions(await response.json());
  }
  useEffect(() => {
    let active = true;
    fetch(url).then(r => { if (!r.ok) throw new Error("Could not load history. Please retry."); return r.json(); }).then(result => { if (active) setVersions(result); }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [url]);
  async function run(body: object, method: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update history.");
      if (result.resume) useResumeStore.getState().setInitialData(result.resume);
      setLabel(""); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Please retry."); }
    finally { setBusy(false); }
  }
  return <div className="fixed inset-0 z-[85] grid place-items-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label="Version history">
    <section className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-3xl bg-white p-6 shadow-xl">
      <header className="flex justify-between gap-4"><h2 className="text-2xl font-bold">Version history</h2><button disabled={busy} onClick={onClose}>Close</button></header>
      <p className="my-3 text-sm text-slate-600">Versions are saved to your account. Restoring keeps a recovery copy of your current resume.</p>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); run({ label, snapshot: data }, "POST"); }}><input aria-label="Version name" required maxLength={80} value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Marketing role — September" className="min-w-0 flex-1 rounded-xl border p-3"/><button disabled={busy} className="rounded-xl bg-slate-900 px-4 text-white">Save version</button></form>
      {error && <p role="alert" className="my-3 text-red-700">{error} <button onClick={() => load().catch(e => setError(e.message))}>Retry</button></p>}
      {dirty && <p role="status" className="my-3 text-sm text-amber-800">Waiting for your latest edits to save before restoring.</p>}
      {!versions.length && <p className="py-6 text-slate-500">No saved versions yet.</p>}
      <ul className="mt-4 space-y-3">{versions.map(v => <li key={v.id} className="rounded-xl border p-3"><p className="font-semibold">{v.label}</p><p className="text-xs text-slate-500">{new Date(v.createdAt).toLocaleString()}</p><div className="mt-2 flex gap-4"><button disabled={busy || dirty} className="font-semibold text-indigo-700 disabled:opacity-40" onClick={() => run({ versionId: v.id, action: "restore" }, "PATCH")}>Restore</button><button disabled={busy} onClick={() => { const name = window.prompt("Version name", v.label); if (name?.trim()) run({ versionId: v.id, action: "rename", label: name }, "PATCH"); }}>Rename</button></div></li>)}</ul>
    </section>
  </div>;
}
