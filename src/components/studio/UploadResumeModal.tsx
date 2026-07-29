"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/useResumeStore";

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Stage = "idle" | "uploading" | "parsing" | "done" | "error";

export function UploadResumeModal({ isOpen, onClose }: UploadResumeModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");

  const setInitialData = useResumeStore((s) => s.setInitialData);
  const data = useResumeStore((s) => s.data);

  const reset = () => {
    setStage("idle");
    setErrorMsg("");
    setFileName("");
    setDragOver(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const processFile = useCallback(async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStage("error");
      setErrorMsg("Only PDF files are supported. Please upload a .pdf file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStage("error");
      setErrorMsg("File is too large. Please upload a PDF under 5MB.");
      return;
    }

    setFileName(file.name);
    setStage("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStage("parsing");
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to parse resume");
      }

      const { parsed } = json;

      // Guard: must have existing data in store
      if (!data) throw new Error("No resume data loaded. Please reload the page.");

      // Check if we actually extracted anything useful
      const hasMeaningfulData = 
        (Array.isArray(parsed.experience) && parsed.experience.length > 0) ||
        (Array.isArray(parsed.education) && parsed.education.length > 0) ||
        (Array.isArray(parsed.skills) && parsed.skills.length > 0) ||
        (parsed.summary?.trim()?.length > 10);

      if (!hasMeaningfulData && !parsed.contact?.fullName) {
        throw new Error("Could not extract any text from this PDF. It might be a scanned image.");
      }

      // Build a fully merged resume data object so ALL sections are populated & visible
      const experience = Array.isArray(parsed.experience) && parsed.experience.length > 0
        ? parsed.experience
        : data.experience;

      const education = Array.isArray(parsed.education) && parsed.education.length > 0
        ? parsed.education
        : data.education;

      const skills = Array.isArray(parsed.skills) && parsed.skills.length > 0
        ? parsed.skills
        : data.skills;

      const projects = Array.isArray(parsed.projects) && parsed.projects.length > 0
        ? parsed.projects
        : data.projects;

      // Determine which sections now have content → make them visible
      const newVisibility: Record<string, boolean> = {
        ...(data.sectionVisibility ?? {}),
        experience: experience.length > 0,
        education: education.length > 0,
        skills: skills.length > 0,
        projects: projects.length > 0,
      };

      // Ensure all visible sections appear in sectionOrder
      const defaultOrder = ["experience", "education", "skills", "projects", "customSections"];
      const existingOrder: string[] = Array.isArray(data.sectionOrder) ? data.sectionOrder : defaultOrder;
      const newOrder = [
        ...existingOrder,
        ...defaultOrder.filter((s) => !existingOrder.includes(s)),
      ];

      // Merge contact — prefer parsed values over blanks
      const contact = {
        ...data.contact,
        ...(parsed.contact?.fullName  ? { fullName:  parsed.contact.fullName  } : {}),
        ...(parsed.contact?.jobTitle  ? { jobTitle:  parsed.contact.jobTitle  } : {}),
        ...(parsed.contact?.email     ? { email:     parsed.contact.email     } : {}),
        ...(parsed.contact?.phone     ? { phone:     parsed.contact.phone     } : {}),
        ...(parsed.contact?.location  ? { location:  parsed.contact.location  } : {}),
        ...(parsed.contact?.linkedin  ? { linkedin:  parsed.contact.linkedin  } : {}),
        ...(parsed.contact?.website   ? { website:   parsed.contact.website   } : {}),
      };

      const merged = {
        ...data,
        contact,
        summary: parsed.summary || data.summary,
        experience,
        education,
        skills,
        projects,
        sectionOrder: newOrder,
        sectionVisibility: newVisibility,
        hasUnsavedChanges: true,
      };

      console.log("[UploadResumeModal] Calling setInitialData with:", merged);
      setInitialData(merged);
      setStage("done");
    } catch (err: any) {
      console.error(err);
      setStage("error");
      setErrorMsg(err?.message || "Failed to process the PDF.");
    }
  }, [data, setInitialData]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(30,27,50,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-3xl overflow-hidden"
        style={{
          background: "rgba(240,238,250,0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "20px 20px 60px rgba(30,27,50,0.25), -10px -10px 30px rgba(255,255,255,0.5)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c6ff7 0%, #e879a0 100%)", boxShadow: "0 4px 14px rgba(124,111,247,0.4)" }}
            >
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight" style={{ color: "#2d2b3d" }}>Upload Your Resume</h2>
              <p className="text-[12px] font-medium" style={{ color: "#9490b0" }}>We'll auto-fill the template with your details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="neo-btn w-8 h-8 flex items-center justify-center"
            style={{ color: "#6b6880" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-7">
          {stage === "idle" && (
            <>
              {/* Drop Zone */}
              <div
                className="relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl cursor-pointer transition-all duration-200"
                style={{
                  background: dragOver ? "rgba(124,111,247,0.08)" : "rgba(255,255,255,0.4)",
                  border: dragOver ? "2px dashed rgba(124,111,247,0.7)" : "2px dashed rgba(124,111,247,0.3)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "inset 3px 3px 10px rgba(180,178,195,0.25), inset -3px -3px 10px rgba(255,255,255,0.6)"
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    boxShadow: "4px 4px 12px rgba(180,178,195,0.4), -4px -4px 12px rgba(255,255,255,0.85)"
                  }}
                >
                  <FileText className="w-8 h-8" style={{ color: "#7c6ff7" }} />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-bold" style={{ color: "#2d2b3d" }}>
                    Drop your PDF resume here
                  </p>
                  <p className="text-[13px] font-medium mt-1" style={{ color: "#9490b0" }}>
                    or <span style={{ color: "#7c6ff7" }}>click to browse</span> · PDF only · Max 5MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Info note */}
              <div
                className="mt-4 flex items-start gap-3 p-4 rounded-xl text-[12px] font-medium"
                style={{ background: "rgba(124,111,247,0.08)", border: "1px solid rgba(124,111,247,0.2)", color: "#5a55c0" }}
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>
                  Your existing resume data will be <strong>added</strong> to the current template. You can review and edit everything after import.
                </span>
              </div>
            </>
          )}

          {(stage === "uploading" || stage === "parsing") && (
            <div className="flex flex-col items-center justify-center gap-5 py-12">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(124,111,247,0.15), rgba(232,121,160,0.12))", boxShadow: "6px 6px 20px rgba(180,178,195,0.4), -6px -6px 20px rgba(255,255,255,0.85)" }}
              >
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#7c6ff7" }} />
              </div>
              <div className="text-center">
                <p className="text-[16px] font-extrabold" style={{ color: "#2d2b3d" }}>
                  {stage === "uploading" ? "Uploading…" : "AI is analyzing your resume…"}
                </p>
                <p className="text-[13px] font-medium mt-1" style={{ color: "#9490b0" }}>
                  {stage === "parsing" ? "Intelligently categorizing experience & skills" : "Reading your file"}
                </p>
              </div>
              {fileName && (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.5)", color: "#4a4760", border: "1px solid rgba(255,255,255,0.7)" }}
                >
                  <FileText className="w-4 h-4" style={{ color: "#7c6ff7" }} />
                  {fileName}
                </div>
              )}
            </div>
          )}

          {stage === "done" && (
            <div className="flex flex-col items-center justify-center gap-5 py-10">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(124,111,247,0.1))", boxShadow: "6px 6px 20px rgba(180,178,195,0.4), -6px -6px 20px rgba(255,255,255,0.85)" }}
              >
                <CheckCircle className="w-10 h-10" style={{ color: "#16a34a" }} />
              </div>
              <div className="text-center">
                <p className="text-[17px] font-extrabold" style={{ color: "#2d2b3d" }}>Resume Imported! 🎉</p>
                <p className="text-[13px] font-medium mt-1.5" style={{ color: "#6b6880" }}>
                  Your details have been filled into the template.<br />Review and edit anything that needs adjusting.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="accent-btn px-8 py-3 font-bold text-[14px]"
              >
                Review My Resume →
              </button>
            </div>
          )}

          {stage === "error" && (
            <div className="flex flex-col items-center justify-center gap-5 py-10">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.1)", boxShadow: "6px 6px 20px rgba(180,178,195,0.4), -6px -6px 20px rgba(255,255,255,0.85)" }}
              >
                <AlertCircle className="w-10 h-10" style={{ color: "#dc2626" }} />
              </div>
              <div className="text-center">
                <p className="text-[17px] font-extrabold" style={{ color: "#2d2b3d" }}>Couldn't Parse Resume</p>
                <p className="text-[13px] font-medium mt-1.5 max-w-xs" style={{ color: "#6b6880" }}>{errorMsg}</p>
              </div>
              <button
                onClick={reset}
                className="neo-btn px-8 py-3 font-bold text-[14px]"
                style={{ color: "#7c6ff7" }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
