"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Plus, Trash2, Check } from "lucide-react";
import { MonthYearSelector } from "./MonthYearSelector";
import { RichTextEditor } from "./RichTextEditor";

const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all neo-input";
const labelClass = "block text-sm font-semibold mb-1.5";
const labelStyle = { color: "#4a4760" };

export function ExperienceForm({ onClose }: { onClose?: () => void }) {
  const experiences = useResumeStore((state) => state.data?.experience) || [];
  const addExperience = useResumeStore((state) => state.addExperience);
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const removeExperience = useResumeStore((state) => state.removeExperience);

  const handleAdd = () => {
    addExperience({
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--bg-base)" }}>
      <div className="flex-1 overflow-y-auto p-8 pb-28">
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight" style={{ color: "#111111" }}>
          Professional Experience
        </h2>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="relative group rounded-2xl p-6 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "4px 4px 12px rgba(180,178,195,0.4), -4px -4px 12px rgba(255,255,255,0.85)"
              }}
            >
              {/* Delete button */}
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all neo-btn"
                title="Remove experience"
                style={{ color: "#e11d48" }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} style={labelStyle}>Company / Employer</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Job Title</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={labelStyle}>Location</label>
                  <input
                    type="text"
                    value={exp.location || ""}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. New York, NY"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Start Date</label>
                  <MonthYearSelector
                    value={exp.startDate}
                    onChange={(val) => updateExperience(exp.id, { startDate: val })}
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>End Date</label>
                  <MonthYearSelector
                    value={exp.endDate}
                    onChange={(val) => updateExperience(exp.id, { endDate: val })}
                    disabled={exp.current}
                  />
                  <label className="flex items-center gap-2 mt-2.5 text-sm cursor-pointer font-medium" style={{ color: "#6b6880" }}>
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? "Present" : "" })}
                      className="rounded"
                      style={{ accentColor: "#111111" }}
                    />
                    I currently work here
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={labelStyle}>Description</label>
                  <RichTextEditor
                    value={exp.description}
                    onChange={(val) => updateExperience(exp.id, { description: val })}
                    placeholder="Describe your role & achievements"
                  />
                </div>
              </div>
            </div>
          ))}

          {experiences.length === 0 && (
            <div
              className="text-center py-14 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px dashed rgba(124,111,247,0.3)",
                backdropFilter: "blur(8px)"
              }}
            >
              <p className="mb-4 font-medium" style={{ color: "#9490b0" }}>No experiences added yet.</p>
              <button
                onClick={handleAdd}
                className="accent-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </button>
            </div>
          )}

          {experiences.length > 0 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleAdd}
                className="neo-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
                style={{ color: "#111111" }}
              >
                <Plus className="h-4 w-4" />
                Add another position
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          background: "rgba(235,233,245,0.85)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.6)"
        }}
      >
        <button
          onClick={onClose}
          className="accent-btn w-full sm:w-auto px-12 py-3 font-semibold flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Done
        </button>
      </div>
    </div>
  );
}
