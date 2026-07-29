"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CoreTemplate } from "@/components/studio/preview/templates/CoreTemplate";
import { getTemplateConfig } from "@/components/studio/preview/templates/registry";
import { dummyResumeData } from "@/lib/dummyData";
import { Loader2, MoreVertical, Pencil, Trash2, Download, Copy, Plus } from "lucide-react";

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
}

function ResumeCard({ resume, onDelete }: { resume: Resume; onDelete: (id: string) => void }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = getTemplateConfig(resume.templateId);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setScale(entry.contentRect.width / 794);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const handleDelete = async () => {
    if (!confirm("Delete this resume?")) return;
    setIsDeleting(true);
    await fetch(`/api/resumes/${resume.id}`, { method: "DELETE" });
    onDelete(resume.id);
  };

  return (
    <div className="flex flex-col group">
      {/* Card thumbnail */}
      <div
        ref={containerRef}
        className="aspect-[1/1.414] w-full bg-white relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300"
        style={{
          boxShadow: "6px 6px 18px rgba(180,178,195,0.55), -6px -6px 18px rgba(255,255,255,0.9)"
        }}
        onClick={() => router.push(`/dashboard/studio/${resume.id}`)}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "10px 10px 26px rgba(180,178,195,0.65), -10px -10px 26px rgba(255,255,255,0.95), 0 0 0 2px rgba(124,111,247,0.25)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = "6px 6px 18px rgba(180,178,195,0.55), -6px -6px 18px rgba(255,255,255,0.9)")}
      >
        <div
          className="origin-top-left absolute top-0 left-0 pointer-events-none"
          style={{ width: "794px", transform: `scale(${scale})` }}
        >
          <CoreTemplate data={{ ...dummyResumeData, templateId: resume.templateId }} config={config} />
        </div>
        {isDeleting && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(232,230,240,0.7)", backdropFilter: "blur(8px)" }}
          >
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#7c6ff7" }} />
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div>
          <p className="text-[14px] font-bold leading-tight" style={{ color: "#2d2b3d" }}>{resume.title}</p>
          <p className="text-[12px] mt-0.5" style={{ color: "#9490b0" }}>edited {timeAgo(resume.updatedAt)} · A4</p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1.5 rounded-full transition-colors"
            style={{ color: "#9490b0" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#7c6ff7")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9490b0")}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-50 w-44 rounded-2xl py-2 overflow-hidden"
              style={{
                background: "rgba(235,233,245,0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.6)",
                boxShadow: "8px 8px 24px rgba(180,178,195,0.5), -4px -4px 12px rgba(255,255,255,0.8)"
              }}
            >
              <button
                onClick={() => { setMenuOpen(false); router.push(`/dashboard/studio/${resume.id}`); }}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors hover:bg-white/50"
                style={{ color: "#2d2b3d" }}
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors hover:bg-white/50"
                style={{ color: "#2d2b3d" }}
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors hover:bg-white/50"
                style={{ color: "#2d2b3d" }}
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
              <div className="my-1 mx-3" style={{ height: "1px", background: "rgba(124,111,247,0.15)" }} />
              <button
                onClick={() => { setMenuOpen(false); handleDelete(); }}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors hover:bg-red-50/60"
                style={{ color: "#e11d48" }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resumes")
      .then((r) => r.json())
      .then((d) => { setResumes(d.resumes || []); setLoading(false); });
  }, []);

  const handleDelete = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen px-10 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold tracking-tight mb-1" style={{ color: "#2d2b3d" }}>
          My Resumes
        </h1>
        <p className="text-[14px]" style={{ color: "#9490b0" }}>
          Manage your resumes or create a new one. All templates are 100% free.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="neo-raised flex items-center justify-center w-16 h-16 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#7c6ff7" }} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* New Resume Card */}
          <Link href="/dashboard/templates" className="flex flex-col group">
            <div
              className="aspect-[1/1.414] w-full relative rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "2px dashed rgba(124,111,247,0.3)",
                backdropFilter: "blur(8px)"
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.border = "2px dashed rgba(124,111,247,0.6)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(124,111,247,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.border = "2px dashed rgba(124,111,247,0.3)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.2)";
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 neo-raised"
              >
                <Plus className="w-6 h-6" style={{ color: "#7c6ff7" }} />
              </div>
              <span className="text-[13px] font-semibold" style={{ color: "#7c6ff7" }}>New resume</span>
            </div>
            <div className="h-10 mt-3" />
          </Link>

          {/* Existing Resumes */}
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
