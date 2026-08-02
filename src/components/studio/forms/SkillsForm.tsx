"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";

export function SkillsForm({ onClose }: { onClose?: () => void }) {
  const skills = useResumeStore((state) => state.data?.skills) || [];
  const addSkill = useResumeStore((state) => state.addSkill);
  const updateSkill = useResumeStore((state) => state.updateSkill);
  const removeSkill = useResumeStore((state) => state.removeSkill);

  const handleAdd = () => {
    addSkill({
      id: crypto.randomUUID(),
      name: "",
      level: "",
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all neo-input";

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--bg-base)" }}>
      <div className="flex-1 overflow-y-auto p-8 pb-28">
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight" style={{ color: "#111111" }}>
          Skills
        </h2>

        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-3 rounded-2xl p-4 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "4px 4px 12px rgba(180,178,195,0.4), -4px -4px 12px rgba(255,255,255,0.85)"
              }}
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                  className={inputClass}
                  style={{ color: "#111111" }}
                  placeholder="e.g. JavaScript"
                />
              </div>

              <div className="w-1/3">
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, { level: e.target.value })}
                  className={inputClass}
                  style={{ color: "#111111" }}
                >
                  <option value="">Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <button
                onClick={() => removeSkill(skill.id)}
                className="neo-btn w-9 h-9 flex items-center justify-center flex-shrink-0"
                title="Remove skill"
                style={{ color: "#e11d48" }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {skills.length === 0 && (
            <div
              className="text-center py-14 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px dashed rgba(124,111,247,0.3)",
                backdropFilter: "blur(8px)"
              }}
            >
              <p className="mb-4 font-medium" style={{ color: "#9490b0" }}>No skills added yet.</p>
              <button
                onClick={handleAdd}
                className="accent-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Skill
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
          Add Skill
        </button>
      </div>
    </div>
  );
}
