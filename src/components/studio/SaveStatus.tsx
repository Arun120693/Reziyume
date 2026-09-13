"use client";

import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function SaveStatus() {
  const data = useResumeStore(s => s.data);
  const dirty = useResumeStore(s => s.hasUnsavedChanges);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const [retry, setRetry] = useState(0);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!data || !dirty) return;
    let cancelled = false;
    const timer = setTimeout(async function save() {
      if (inFlight.current) return;
      inFlight.current = true;
      setStatus("saving");
      try {
        // Serialize writes so an older response can never overwrite a newer edit.
        let snapshot = useResumeStore.getState().data;
        while (snapshot && !cancelled) {
          const response = await fetch(`/api/resumes/${snapshot.id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(snapshot),
          });
          if (!response.ok) throw new Error("Save failed");
          if (useResumeStore.getState().data === snapshot) {
            useResumeStore.getState().markSaved();
            break;
          }
          snapshot = useResumeStore.getState().data;
        }
        setStatus("saved");
      } catch {
        setStatus("error");
      } finally {
        inFlight.current = false;
        // If editing cancelled this effect during a request, schedule the latest data.
        if (cancelled) setRetry(value => value + 1);
      }
    }, 900);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [data, dirty, retry]);

  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => {
      if (useResumeStore.getState().hasUnsavedChanges) { event.preventDefault(); event.returnValue = ""; }
    };
    const protectNavigation = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (link && useResumeStore.getState().hasUnsavedChanges && !window.confirm("Your latest changes have not saved yet. Leave this page anyway?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", protect);
    document.addEventListener("click", protectNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", protect);
      document.removeEventListener("click", protectNavigation, true);
    };
  }, []);

  if (status === "error") return <button onClick={() => setRetry(n => n + 1)} className="text-xs text-red-700" role="alert">Save failed · Retry</button>;
  return <span role="status" className="text-[11px] text-stone-600">{status === "saving" ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}</span>;
}
