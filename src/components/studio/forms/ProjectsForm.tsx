"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all neo-input";
const labelClass = "block text-sm font-semibold mb-1.5";
const labelStyle = { color: "#4a4760" };

export function ProjectsForm() {
  const projects = useResumeStore((state) => state.data?.projects) || [];
  const addProject = useResumeStore((state) => state.addProject);
  const updateProject = useResumeStore((state) => state.updateProject);
  const removeProject = useResumeStore((state) => state.removeProject);

  const handleAdd = () => {
    addProject({
      id: crypto.randomUUID(),
      name: "",
      description: "",
      url: "",
      technologies: [],
    });
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--bg-base)" }}>
      <div className="flex-1 overflow-y-auto p-8 pb-28">
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight" style={{ color: "#111111" }}>
          Projects
        </h2>

        <div className="space-y-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="relative group rounded-2xl p-6 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "4px 4px 12px rgba(180,178,195,0.4), -4px -4px 12px rgba(255,255,255,0.85)"
              }}
            >
              <button
                onClick={() => removeProject(proj.id)}
                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all neo-btn"
                title="Remove project"
                style={{ color: "#e11d48" }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className={labelClass} style={labelStyle}>Project Name</label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. E-Commerce Dashboard"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>URL / Link (Optional)</label>
                  <input
                    type="text"
                    value={proj.url}
                    onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. https://github.com/my-project"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Technologies Used (comma separated)</label>
                  <input
                    type="text"
                    value={proj.technologies.join(", ")}
                    onChange={(e) => {
                      const techArray = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                      updateProject(proj.id, { technologies: techArray.length ? techArray : e.target.value ? e.target.value.split(",") : [] });
                    }}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. React, Node.js, Tailwind CSS"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Description</label>
                  <RichTextEditor
                    value={proj.description || ""}
                    onChange={(val) => updateProject(proj.id, { description: val })}
                    placeholder="Describe what the project does and your contribution."
                  />
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div
              className="text-center py-14 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px dashed rgba(124,111,247,0.3)",
                backdropFilter: "blur(8px)"
              }}
            >
              <p className="mb-4 font-medium" style={{ color: "#9490b0" }}>No projects added yet.</p>
              <button
                onClick={handleAdd}
                className="accent-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 p-4 flex gap-3"
        style={{
          background: "rgba(235,233,245,0.85)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.6)"
        }}
      >
        <button
          onClick={handleAdd}
          className="neo-btn flex-1 py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2"
          style={{ color: "#111111" }}
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
    </div>
  );
}
