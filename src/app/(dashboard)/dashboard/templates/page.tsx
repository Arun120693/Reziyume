"use client";

import { CoreTemplate } from "@/components/studio/preview/templates/CoreTemplate";
import { dummyResumeData } from "@/lib/dummyData";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { templates } from "@/components/studio/preview/templates/registry";
import { Loader2, X, Star, Layout, Cpu, Palette, Camera } from "lucide-react";
import Link from "next/link";

const FILTER_TABS = [
  { id: "all",      label: "All Templates", icon: null },
  { id: "popular",  label: "Popular",        icon: Star },
  { id: "photo",    label: "With Photo",     icon: Camera },
  { id: "simple",   label: "Simple",         icon: Layout },
  { id: "modern",   label: "Modern",         icon: Cpu },
  { id: "creative", label: "Creative",       icon: Palette },
];

const CATEGORY_MAP: Record<string, string> = {
  Professional: "simple",
  Minimalist:   "simple",
  Modern:       "modern",
  Creative:     "creative",
  Photo:        "photo",
};

function TemplateCard({ template, isCreating, selectedId, onSelect }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (let e of entries) setScale(e.contentRect.width / 794);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="group flex flex-col cursor-pointer" onClick={() => onSelect(template.id)}>
      {/* Preview card */}
      <div
        ref={containerRef}
        className="aspect-[1/1.414] w-full bg-white relative overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          boxShadow: "6px 6px 18px rgba(180,178,195,0.5), -6px -6px 18px rgba(255,255,255,0.9)"
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "10px 10px 28px rgba(0,0,0,0.1), -6px -6px 18px rgba(255,255,255,0.95), 0 0 0 2px rgba(124,111,247,0.3)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = "6px 6px 18px rgba(180,178,195,0.5), -6px -6px 18px rgba(255,255,255,0.9)")}
      >
        <div
          className="origin-top-left absolute top-0 left-0 pointer-events-none"
          style={{ width: "794px", transform: `scale(${scale})` }}
        >
          <CoreTemplate data={{ ...dummyResumeData, templateId: template.id }} config={template} />
        </div>

        {isCreating && selectedId === template.id && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(232,230,240,0.75)", backdropFilter: "blur(10px)" }}
          >
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#111111" }} />
          </div>
        )}

        {template.supportsPhoto && (
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #333333, #111111)", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          >
            <Camera className="w-3 h-3" />
            Photo
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "linear-gradient(to top, rgba(44,42,61,0.15) 0%, transparent 70%)" }}
        >
          <div className="px-5 py-2 rounded-full text-[13px] font-bold"
            style={{
              background: "rgba(235,233,245,0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.7)",
              color: "#111111",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)"
            }}
          >
            Use Template
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <p className="text-[12px] font-bold uppercase tracking-widest text-center" style={{ color: "#4a4760" }}>
          {template.name}
        </p>
        {template.supportsPhoto && (
          <Camera className="w-3 h-3 flex-shrink-0" style={{ color: "#666666" }} />
        )}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSelectTemplate = async (templateId: string) => {
    if (isCreating) return;
    try {
      setIsCreating(true);
      setSelectedId(templateId);
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create resume");
      }
      const data = await res.json();
      router.push(`/dashboard/studio/${data.resume.id}`);
    } catch (err: any) {
      setIsCreating(false);
      setSelectedId(null);
      alert("Something went wrong: " + err.message);
    }
  };

  const filteredTemplates = templates.filter((t) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "popular") return ["onyx", "diamond", "sapphire", "quartz", "portrait", "nova"].includes(t.id);
    if (activeFilter === "photo") return t.supportsPhoto === true;
    return CATEGORY_MAP[t.category] === activeFilter;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <div className="flex items-start justify-between px-10 pt-10 pb-6">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: "#111111" }}>
            Apply a design template
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "#9490b0" }}>
            Choose a template to start building your resume
          </p>
        </div>
        <Link
          href="/dashboard"
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all neo-raised"
        >
          <X className="w-4 h-4" style={{ color: "#6b6880" }} />
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="px-10 pb-8 flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, #333333 0%, #111111 100%)",
                      color: "white",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.12)"
                    }
                  : {
                      background: "rgba(255,255,255,0.4)",
                      color: "#6b6880",
                      border: "1px solid rgba(255,255,255,0.7)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "3px 3px 8px rgba(180,178,195,0.4), -3px -3px 8px rgba(255,255,255,0.8)"
                    }
              }
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Template grid */}
      <div className="px-10 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isCreating={isCreating}
              selectedId={selectedId}
              onSelect={handleSelectTemplate}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 text-sm" style={{ color: "#9490b0" }}>
            No templates in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
