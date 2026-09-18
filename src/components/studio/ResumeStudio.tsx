
"use client";

import { VersionHistory } from "./VersionHistory";
import { WritingAssistant } from "./WritingAssistant";
import { SaveStatus } from "./SaveStatus";
import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { ResumeData } from "@/lib/types/resume";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { CustomSectionsForm } from "./forms/CustomSectionsForm";
import { AddContentDialog } from "./forms/AddContentDialog";
import { ResumePreview } from "./preview/ResumePreview";
import { CustomizePanel } from "./CustomizePanel";
import {
  Loader2, GraduationCap, Briefcase, Wrench, FolderGit2,
  Sparkles, Plus, GripVertical, Eye, EyeOff, ChevronRight,
  LayoutTemplate, Download, ArrowLeft, Upload
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Link from "next/link";
import { UploadResumeModal } from "./UploadResumeModal";
import { getTemplateConfig } from "./preview/templates/registry";
import { StudioTour } from "./StudioTour";
import { ResumeReadiness } from "./ResumeReadiness";


export function ResumeStudio({ initialData }: { initialData: ResumeData }) {
  const setInitialData = useResumeStore((s) => s.setInitialData);
  const data = useResumeStore((s) => s.data);
  const replaceData = useResumeStore((s) => s.replaceData);

  const updateSectionOrder = useResumeStore((s) => s.updateSectionOrder);
  const updateSectionVisibility = useResumeStore((s) => s.updateSectionVisibility);
  const updateName = useResumeStore((s) => s.updateName);

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "customize">("content");
  const [isDownloading, setIsDownloading] = useState(false);
  const [exportStyle, setExportStyle] = useState("visual");
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [fitPage, setFitPage] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showReadiness, setShowReadiness] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showWriting, setShowWriting] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [future, setFuture] = useState<ResumeData[]>([]);
  const previousData = useRef<ResumeData | null>(null);
  const restoringHistory = useRef(false);

  useEffect(() => { setInitialData(initialData); }, [initialData, setInitialData]);
  useEffect(() => {
    if (!data) return;
    if (restoringHistory.current) {
      restoringHistory.current = false;
      previousData.current = data;
      return;
    }
    if (previousData.current && previousData.current !== data) {
      const previous = previousData.current;
      setHistory((items) => [...items.slice(-39), previous]);
      setFuture([]);
    }
    previousData.current = data;
  }, [data]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowTour(window.localStorage.getItem("reziyume-studio-tour-complete") !== "true");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: "#E8E4DC" }}>
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const handleDragEnd = (result: { destination?: { index: number } | null, source: { index: number } }) => {
    if (!result.destination) return;
    const items = Array.from(data.sectionOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    updateSectionOrder(items);
  };

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous || !data) return;
    restoringHistory.current = true;
    setHistory((items) => items.slice(0, -1));
    setFuture((items) => [...items, data]);
    replaceData(previous);
  };

  const redo = () => {
    const next = future[future.length - 1];
    if (!next || !data) return;
    restoringHistory.current = true;
    setFuture((items) => items.slice(0, -1));
    setHistory((items) => [...items, data]);
    replaceData(next);
  };

  const shareResume = async () => {
    if (!data) return;
    const response = await fetch(`/api/resumes/${data.id}/share`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ public: true }) });
    if (!response.ok) { setShareMessage("Could not create link"); return; }
    const result = await response.json();
    const url = `${window.location.origin}${result.url}`;
    await navigator.clipboard?.writeText(url);
    setShareMessage("Link copied");
    window.setTimeout(() => setShareMessage(null), 2500);
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    let capturedElement: HTMLElement | null = null;
    let originalTransform = "";
    let originalMinHeight = "";
    try {
      if (exportStyle === "text") {
        const [{ pdf }, { PdfDocument }] = await Promise.all([import("@react-pdf/renderer"), import("@/components/pdf/PdfDocument")]);
        const config = getTemplateConfig(data.templateId);
        const blob = await pdf(<PdfDocument pageSize={pageSize === "letter" ? "LETTER" : "A4"} data={{ ...data, contact: { ...data.contact, photoBase64: "" } }} config={{ ...config, layout: "single-column", colors: { ...config.colors, background: "#ffffff", text: "#242b30", secondaryText: "#52606a" } }} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${data.name || "Resume"}.pdf`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        return;
      }
      const element = document.getElementById("resume-preview-content");
      if (!element) throw new Error("Resume preview element not found");

      // Wait for fonts to load
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Wait for any images within the preview to load
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if an image fails
        });
      }));

      // Temporarily remove transform for accurate capture
      capturedElement = element;
      originalTransform = element.style.transform;
      originalMinHeight = element.style.minHeight;
      element.style.transform = "none";
      element.style.minHeight = "0";

      // CRITICAL: Wait for a few animation frames AFTER removing transform
      // to ensure the browser recalculates the layout and font metrics at scale=1
      // Without this, html2canvas captures stale computed styles, causing alignment regressions
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      // html2canvas config
      const [{ captureResume }, { createVisualPdf }] = await Promise.all([import("@/lib/export/captureResume"), import("@/lib/export/createVisualPdf")]);
      const { measureProtectedBands } = await import("@/lib/export/pagination");
      const bands = measureProtectedBands(element);
      const measuredWidth = element.getBoundingClientRect().width;
      const canvas = await captureResume(element);

      // Restore transform
      element.style.transform = originalTransform;
      element.style.minHeight = originalMinHeight;

      const blob = createVisualPdf(canvas, { pageSize, fit: fitPage, bands, measuredWidth });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.name || "Resume"}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("PDF generation failed:", error);

      if (error instanceof Error) {
          console.error(error.message);
          console.error(error.stack);
      }

      alert(error instanceof Error ? error.message : String(error));
    } finally {
      if (capturedElement) {
        capturedElement.style.transform = originalTransform;
        capturedElement.style.minHeight = originalMinHeight;
      }
      setIsDownloading(false);
    }
  };

  const sectionMeta: Record<string, { icon: React.ElementType; label: string }> = {
    experience:     { icon: Briefcase,    label: "Experience" },
    education:      { icon: GraduationCap, label: "Education" },
    skills:         { icon: Wrench,       label: "Skills" },
    projects:       { icon: FolderGit2,   label: "Projects" },
    customSections: { icon: Sparkles,     label: "Custom Sections" },
  };

  const renderForm = () => {
    const close = () => setActiveForm(null);
    switch (activeForm) {
      case "personalDetails": return <PersonalDetailsForm onClose={close} />;
      case "experience":      return <ExperienceForm onClose={close} />;
      case "education":       return <EducationForm onClose={close} />;
      case "skills":          return <SkillsForm />;
      case "projects":        return <ProjectsForm />;
      case "customSections":  return <CustomSectionsForm onClose={close} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
          <LayoutTemplate className="w-8 h-8" />
          <p className="text-sm">Form for <b>{activeForm}</b> coming soon.</p>
          <button onClick={close} className="text-sm text-pink-600 hover:underline">← Go back</button>
        </div>
      );
    }
  };

  const tabs = [
    { id: "content",  label: "Content",  icon: "📄", pink: true },
    { id: "customize",label: "Customize",icon: "✏️" },
  ] as const;

  const handleTourAction = (action?: string) => {
    window.localStorage.setItem("reziyume-studio-tour-complete", "true");
    setShowTour(false);
    if (action === "Upload Resume") setIsUploadModalOpen(true);
    if (action === "Open Content") { setActiveTab("content"); setActiveForm(null); }
    if (action === "Open Photo details") { setActiveTab("content"); setActiveForm("personalDetails"); }
    if (action === "Open Customize") { setActiveTab("customize"); setActiveForm(null); }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
      {/* Top nav bar — glass */}
      <div
        className="px-4 py-3 flex flex-wrap gap-3 items-center justify-between min-h-[56px] flex-shrink-0"
        style={{
          background: "rgba(250,249,246,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 1px 0 rgba(124,111,247,0.08)"
        }}
      >
        {/* Left: back + tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {activeForm ? (
            <button
              onClick={() => setActiveForm(null)}
              aria-label="Back to sections"
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all mr-1 neo-btn"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "#6b6880" }} />
            </button>
          ) : (
            <Link href="/dashboard" aria-label="Back to dashboard" className="flex items-center justify-center w-9 h-9 rounded-xl transition-all mr-1 neo-btn">
              <ArrowLeft className="w-4 h-4" style={{ color: "#6b6880" }} />
            </Link>
          )}
          {/* Upload Resume button — before Content/Customize tabs */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13.5px] font-extrabold transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))",
              color: "#111111",
              border: "1.5px solid rgba(0,0,0,0.1)",
              boxShadow: "3px 3px 8px rgba(180,178,195,0.4), -3px -3px 8px rgba(255,255,255,0.8)"
            }}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Resume
          </button>

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "rgba(124,111,247,0.15)", margin: "0 4px" }} />

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveForm(null); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13.5px] font-extrabold transition-all"
              style={
                activeTab === tab.id
                  ? {
                      background: tab.id === "content"
                        ? "linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.04))"
                        : "rgba(255,255,255,0.75)",
                      color: tab.id === "content" ? "#111111" : "#111111",
                      boxShadow: "3px 3px 8px rgba(180,178,195,0.45), -3px -3px 8px rgba(255,255,255,0.8)",
                      border: "1px solid rgba(255,255,255,0.6)"
                    }
                  : { color: "#6b6880", border: "1px solid transparent" }
              }
            >
              <span className="text-[12px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: resume name + download */}
        <div className="flex flex-wrap items-center gap-2">
          <SaveStatus />
          <select aria-label="PDF page size" value={pageSize} onChange={e => setPageSize(e.target.value as "a4" | "letter")} className="rounded-xl border bg-white px-3 py-3 text-sm"><option value="a4">A4 paper</option><option value="letter">US Letter</option></select>
          {exportStyle === "visual" && <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={fitPage} onChange={e => setFitPage(e.target.checked)}/>Fit one page (shrinks text)</label>}
          <button onClick={() => setShowWriting(true)} className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800">AI writer</button>
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1 py-1">
            <button onClick={undo} disabled={history.length === 0} aria-label="Undo last change" title="Undo" className="rounded-lg px-2 py-1 text-sm font-bold text-slate-600 disabled:opacity-30">↶</button>
            <button onClick={redo} disabled={future.length === 0} aria-label="Redo last change" title="Redo" className="rounded-lg px-2 py-1 text-sm font-bold text-slate-600 disabled:opacity-30">↷</button>
          </div>
          <button onClick={() => setShowVersions(true)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:border-pink-300 hover:text-pink-600">Save version</button>
          <button onClick={() => setShowVersions((open) => !open)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:border-pink-300 hover:text-pink-600">History</button>
          <button onClick={shareResume} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:border-pink-300 hover:text-pink-600">Share</button>
          {shareMessage && <span className="text-xs font-semibold text-emerald-600">{shareMessage}</span>}
          <input
            aria-label="Resume name"
            type="text"
            value={data.name || ""}
            onChange={(e) => updateName(e.target.value)}
            placeholder="Untitled Resume"
            className="w-40 neo-input px-3 py-1.5 text-[13px] font-medium"
            style={{ color: "#111111" }}
          />
          <select aria-label="PDF format" value={exportStyle} onChange={e => setExportStyle(e.target.value)} className="max-w-40 rounded-lg border border-stone-200 bg-white px-2 py-2 text-xs">
            <option value="visual">PDF matching preview</option><option value="text">Text PDF · single column</option>
          </select>
          <button
            onClick={() => setShowReadiness(true)}
            className="rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white shadow-md transition-transform hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", boxShadow: "0 5px 14px rgba(139,92,246,0.28)" }}
          >
            ATS Score
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="accent-btn flex items-center gap-2 px-4 py-2 text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? "Saving..." : "Download"}
          </button>

        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-[440px] xl:w-[500px] flex-shrink-0 flex flex-col overflow-hidden bg-transparent">
          {activeTab === "content" && (
            activeForm ? (
              <div className="flex-1 overflow-hidden bg-white/0">
                {renderForm()}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-4 rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-pink-600">Build tip</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Start with Personal Details, then add your most recent experience. Use short bullets that begin with an action verb and include a measurable result when possible.</p>
                </div>
                <div className="space-y-3">
                  {/* Personal Details card (always first, not draggable) */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Edit personal details"
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveForm("personalDetails"); } }}
                    onClick={() => setActiveForm("personalDetails")}
                    className="group flex items-center gap-3 p-4 rounded-2xl cursor-pointer relative transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.75)",
                      boxShadow: "4px 4px 12px rgba(180,178,195,0.45), -4px -4px 12px rgba(255,255,255,0.85)"
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "6px 6px 18px rgba(124,111,247,0.2), -4px -4px 12px rgba(255,255,255,0.9), 0 0 0 1.5px rgba(0,0,0,0.1)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "4px 4px 12px rgba(180,178,195,0.45), -4px -4px 12px rgba(255,255,255,0.85)")}
                  >
                    {/* gradient edit button top-right */}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #333333 0%, #111111 100%)", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-slate-800">
                        {data.contact.fullName || "John Doe"}
                      </p>
                      <p className="text-[12px] text-slate-500 truncate">
                        {data.contact.jobTitle || "Job Title"}
                      </p>
                      <div className="flex flex-wrap gap-x-3 mt-1">
                        {data.contact.email && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>✉</span> {data.contact.email}
                          </span>
                        )}
                        {data.contact.phone && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>☎</span> {data.contact.phone}
                          </span>
                        )}
                        {data.contact.location && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>📍</span> {data.contact.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Draggable section cards */}
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                          {data.sectionOrder.map((sectionId, index) => {
                            const isVisible = data.sectionVisibility?.[sectionId] ?? true;
                            const meta = sectionMeta[sectionId] || { icon: LayoutTemplate, label: sectionId };
                            const Icon = meta.icon;

                            return (
                              <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`group rounded-2xl transition-all duration-200 ${!isVisible ? "opacity-50" : ""}`}
                                    style={{
                                      background: "rgba(255,255,255,0.5)",
                                      backdropFilter: "blur(10px)",
                                      border: snapshot.isDragging ? "1.5px solid rgba(124,111,247,0.5)" : "1px solid rgba(255,255,255,0.75)",
                                      boxShadow: snapshot.isDragging
                                        ? "10px 10px 28px rgba(0,0,0,0.1), -4px -4px 12px rgba(255,255,255,0.9)"
                                        : "4px 4px 12px rgba(180,178,195,0.4), -4px -4px 12px rgba(255,255,255,0.85)",
                                      transform: snapshot.isDragging ? `rotate(1deg) ${provided.draggableProps.style?.transform || ""}` : provided.draggableProps.style?.transform || ""
                                    }}
                                  >
                                    {/* Section header */}
                                    <div className="flex items-center gap-3 px-4 py-3.5">
                                      <div {...provided.dragHandleProps} aria-label={`Reorder ${meta.label}`} className="cursor-grab active:cursor-grabbing -ml-1" style={{ color: "#c8c6d6" }}>
                                        <GripVertical className="h-4 w-4" />
                                      </div>
                                      <Icon className="w-4 h-4" style={{ color: "#111111" }} />
                                      <span
                                        className="flex-1 text-[14px] font-bold cursor-pointer"
                                        style={{ color: "#111111" }}
                                        onClick={() => setActiveForm(sectionId)}
                                      >
                                        {meta.label}
                                      </span>
                                      <div className="flex flex-wrap items-center gap-1">
                                        <button
                                          aria-label={`${isVisible ? "Hide" : "Show"} ${meta.label}`}
                                          aria-pressed={isVisible}
                                          onClick={(e) => { e.stopPropagation(); updateSectionVisibility(sectionId, !isVisible); }}
                                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                          aria-label={`Edit ${meta.label}`}
                                          onClick={() => setActiveForm(sectionId)}
                                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors"
                                        >
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Keyboard-accessible entry action. */}
                                    <button
                                      type="button"
                                      className="w-full border-t border-slate-100 px-4 py-3 flex items-center justify-between cursor-pointer text-slate-500"
                                      aria-label={`Add or edit ${meta.label.toLowerCase()} entries`}
                                      onClick={() => setActiveForm(sectionId)}
                                    >
                                      <span className="flex items-center gap-2 text-[12px]"><Plus size={14}/>Add Entry / Edit</span>
                                      <ChevronRight size={14}/>
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {/* Add Content button — FlowCV pink gradient */}
                  <button
                    onClick={() => setIsAddContentOpen(true)}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
                    style={{ background: "linear-gradient(135deg, #666666 0%, #333333 100%)" }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Content
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === "customize" && (
            <div className="flex-1 overflow-y-auto">
              <CustomizePanel />
            </div>
          )}
        </div>

        {/* Right panel: preview on beige bg */}
        <div className="flex-1 min-w-0 overflow-y-auto flex justify-center items-start p-4 sm:p-8" style={{ backgroundColor: "#E8E4DC" }}>
          <div className="w-full max-w-[794px]">
            <ResumePreview />
          </div>
        </div>
      </div>

      <AddContentDialog
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onSelect={(sectionId) => {
          if (!data.sectionOrder.includes(sectionId)) {
            updateSectionOrder([...data.sectionOrder, sectionId]);
            updateSectionVisibility(sectionId, true);
          }
          setIsAddContentOpen(false);
          setActiveForm(sectionId);
        }}
        addedSections={data.sectionOrder.filter((id) => data.sectionVisibility?.[id] !== false)}
      />

      <UploadResumeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      {showTour && <StudioTour onAction={handleTourAction} onClose={() => setShowTour(false)} />}
      {showReadiness && <ResumeReadiness data={data} onClose={() => setShowReadiness(false)} />}
      {showVersions && <VersionHistory onClose={() => setShowVersions(false)} />}
      {showWriting && <WritingAssistant onClose={() => setShowWriting(false)} />}
    </div>
  );
}
