"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";
import { MonthYearSelector } from "./MonthYearSelector";
import { RichTextEditor } from "./RichTextEditor";

const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all neo-input";
const labelClass = "block text-sm font-semibold mb-1.5";
const labelStyle = { color: "#4a4760" };

export function EducationForm({ onClose }: { onClose?: () => void }) {
  const educations = useResumeStore((state) => state.data?.education) || [];
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

  const handleAdd = () => {
    addEducation({
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: "",
    });
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--bg-base)" }}>
      <div className="flex-1 overflow-y-auto p-8 pb-28">
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight" style={{ color: "#111111" }}>
          Education
        </h2>

        <div className="space-y-6">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="relative group rounded-2xl p-6 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "4px 4px 12px rgba(180,178,195,0.4), -4px -4px 12px rgba(255,255,255,0.85)"
              }}
            >
              <button
                onClick={() => removeEducation(edu.id)}
                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all neo-btn"
                title="Remove education"
                style={{ color: "#e11d48" }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} style={labelStyle}>School / University</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. Stanford University"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Location</label>
                  <input
                    type="text"
                    value={edu.location || ""}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                    className={inputClass}
                    style={{ color: "#111111" }}
                    placeholder="e.g. Stanford, CA"
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>Start Date</label>
                  <MonthYearSelector
                    value={edu.startDate}
                    onChange={(val) => updateEducation(edu.id, { startDate: val })}
                  />
                </div>

                <div>
                  <label className={labelClass} style={labelStyle}>End Date</label>
                  <MonthYearSelector
                    value={edu.endDate}
                    onChange={(val) => updateEducation(edu.id, { endDate: val })}
                    disabled={edu.current}
                  />
                  <label className="flex items-center gap-2 mt-2.5 text-sm cursor-pointer font-medium" style={{ color: "#6b6880" }}>
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) => updateEducation(edu.id, { current: e.target.checked, endDate: e.target.checked ? "Present" : "" })}
                      className="rounded"
                      style={{ accentColor: "#111111" }}
                    />
                    I currently study here
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={labelStyle}>Description / Achievements</label>
                  <RichTextEditor
                    value={edu.description || ""}
                    onChange={(val) => updateEducation(edu.id, { description: val })}
                    placeholder="Describe your achievements, coursework, etc."
                  />
                </div>
              </div>
            </div>
          ))}

          {educations.length === 0 && (
            <div
              className="text-center py-14 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px dashed rgba(124,111,247,0.3)",
                backdropFilter: "blur(8px)"
              }}
            >
              <p className="mb-4 font-medium" style={{ color: "#9490b0" }}>No education added yet.</p>
              <button
                onClick={handleAdd}
                className="accent-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Education
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
          Add Education
        </button>
      </div>
    </div>
  );
}
