"use client";

import { useEffect, useState } from "react";
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
  LayoutTemplate, Download, MoreVertical, ArrowLeft, Upload
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Link from "next/link";
import { UploadResumeModal } from "./UploadResumeModal";
import { getTemplateConfig } from "./preview/templates/registry";
import { pdf } from "@react-pdf/renderer";
import { PdfDocument } from "../pdf/PdfDocument";

export function ResumeStudio({ initialData }: { initialData: ResumeData }) {
  const setInitialData = useResumeStore((s) => s.setInitialData);
  const data = useResumeStore((s) => s.data);

  if (data) {
    console.log("======================================================");
    console.log("STAGE 5: ResumeStudio (Rendering with data from store)");
    console.log("Summary:", !!data.summary);
    console.log("Experience Length:", data.experience?.length || 0);
    console.log("Education Length:", data.education?.length || 0);
    console.log("Skills Length:", data.skills?.length || 0);
    console.log("Projects Length:", data.projects?.length || 0);
    console.log("CustomSections Length:", data.customSections?.length || 0);
    console.log("======================================================");
  }

  const updateSectionOrder = useResumeStore((s) => s.updateSectionOrder);
  const updateSectionVisibility = useResumeStore((s) => s.updateSectionVisibility);
  const updateName = useResumeStore((s) => s.updateName);

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "customize">("content");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => { setInitialData(initialData); }, [initialData, setInitialData]);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: "#E8E4DC" }}>
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(data.sectionOrder);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    updateSectionOrder(items);
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const config = getTemplateConfig(data.templateId || 'ruby');
      const blob = await pdf(<PdfDocument data={data} config={config} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.name || 'Resume'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("React-PDF generation failed:", error);

      if (error instanceof Error) {
          console.error(error.message);
          console.error(error.stack);
      }

      alert(error instanceof Error ? error.message : String(error));
    } finally {
      setIsDownloading(false);
    }
  };

  const sectionMeta: Record<string, { icon: any; label: string }> = {
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
      case "skills":          return <SkillsForm onClose={close} />;
      case "projects":        return <ProjectsForm onClose={close} />;
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

  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
      {/* Top nav bar — glass */}
      <div
        className="flex-shrink-0 px-4 flex items-center justify-between h-[56px] flex-shrink-0"
        style={{
          background: "rgba(235,233,245,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 1px 0 rgba(124,111,247,0.08)"
        }}
      >
        {/* Left: back + tabs */}
        <div className="flex items-center gap-1">
          {activeForm ? (
            <button
              onClick={() => setActiveForm(null)}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all mr-1 neo-btn"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "#6b6880" }} />
            </button>
          ) : (
            <Link href="/dashboard" className="flex items-center justify-center w-9 h-9 rounded-xl transition-all mr-1 neo-btn">
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => updateName(e.target.value)}
            placeholder="Untitled Resume"
            className="w-40 neo-input px-3 py-1.5 text-[13px] font-medium"
            style={{ color: "#111111" }}
          />
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="accent-btn flex items-center gap-2 px-4 py-2 text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? "Saving..." : "Download"}
          </button>
          <button className="neo-btn w-8 h-8 flex items-center justify-center">
            <MoreVertical className="w-4 h-4" style={{ color: "#6b6880" }} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <div className="w-[540px] flex-shrink-0 flex flex-col overflow-hidden bg-transparent">
          {activeTab === "content" && (
            activeForm ? (
              <div className="flex-1 overflow-hidden bg-white/0">
                {renderForm()}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-3">
                  {/* Personal Details card (always first, not draggable) */}
                  <div
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
                                      <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing -ml-1" style={{ color: "#c8c6d6" }}>
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
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); updateSectionVisibility(sectionId, !isVisible); }}
                                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                          onClick={() => setActiveForm(sectionId)}
                                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors"
                                        >
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* "+ Add Entry" footer row */}
                                    <div
                                      className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between cursor-pointer group/add"
                                      onClick={() => setActiveForm(sectionId)}
                                    >
                                      <div className="flex items-center gap-2 text-[12px] text-slate-400">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        Add Entry / Edit
                                      </div>
                                      <button className="text-slate-300 hover:text-red-500 transition-colors">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                      </button>
                                    </div>
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
        <div className="flex-1 overflow-y-auto flex justify-center items-start p-8" style={{ backgroundColor: "#E8E4DC" }}>
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
    </div>
  );
}
