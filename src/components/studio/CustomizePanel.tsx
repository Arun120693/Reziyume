"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";

const ACCENT_COLORS = [
  "#1e2a3b", "#2563eb", "#7c3aed", "#db2777", "#059669",
  "#d97706", "#dc2626", "#0284c7", "#64748b", "#000000",
];

const FONT_OPTIONS = [
  "Inter", "Roboto", "Georgia", "Merriweather", "Lato",
  "Poppins", "Playfair Display", "Source Sans Pro", "Montserrat", "Zilla Slab",
];

export function CustomizePanel() {
  const data = useResumeStore((s) => s.data);
  const updateFormatting = useResumeStore((s) => s.updateFormatting);

  if (!data) return null;

  const fmt = data.formatting || {};

  const navItems = [
    "Document", "Templates", "Layout", "Font Size",
    "Spacing", "Entries", "Headings", "Font", "Colors",
    "Header", "Photo", "Links", "Footer", "Sections"
  ];

  return (
    <div className="flex h-full">
      {/* Sub-nav */}
      <div className="w-[120px] flex-shrink-0 flex flex-col py-4 gap-0.5 border-r border-slate-200/60 bg-white/30">
        {navItems.map((item, i) => (
          <button
            key={item}
            className={`text-left text-[12.5px] px-4 py-2 transition-colors ${
              item === "Font"
                ? "font-semibold text-slate-800 border-l-2 border-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Font card */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-[16px] font-bold text-slate-800">Font</h3>

          <div>
            <label className="text-[12px] font-semibold text-slate-600 mb-2 block">Body Font</label>
            <select
              value={fmt.fontFamily || "Inter"}
              onChange={(e) => updateFormatting({ fontFamily: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300"
            >
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-600 mb-2 block">Name Font</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300"
            >
              <option>Same as body font</option>
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Colors card */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-[16px] font-bold text-slate-800">Colors</h3>

          {/* Color mode thumbnails */}
          <div className="flex gap-3">
            {["Full Page", "Column", "Border"].map((mode) => (
              <div key={mode} className="flex flex-col items-center gap-1.5">
                <div className={`w-14 h-16 rounded-lg border-2 ${mode === "Column" ? "border-indigo-600" : "border-slate-200"} overflow-hidden bg-white flex`}>
                  {mode === "Column" && <div className="w-1/2 h-full bg-indigo-600/80" />}
                  {mode === "Border" && <div className="w-1 h-full bg-slate-400/50" />}
                </div>
                <span className="text-[11px] text-slate-500">{mode}</span>
              </div>
            ))}
          </div>

          {/* Accent colors */}
          <div>
            <label className="text-[12px] font-semibold text-slate-600 mb-2 block">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateFormatting({ accentColor: color })}
                  className={`w-7 h-7 rounded-full transition-all ${
                    (fmt.accentColor || "#1e2a3b") === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-[16px] font-bold text-slate-800">Spacing</h3>
          <div className="flex gap-2">
            {["compact", "normal", "relaxed"].map((s) => (
              <button
                key={s}
                onClick={() => updateFormatting({ margins: s })}
                className={`flex-1 py-2 rounded-lg text-[12px] font-medium border transition-colors capitalize ${
                  (fmt.margins || "normal") === s
                    ? "border-slate-800 bg-slate-800 text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-[16px] font-bold text-slate-800">Font Size</h3>
          <div className="flex gap-2">
            {["small", "medium", "large"].map((s) => (
              <button
                key={s}
                onClick={() => updateFormatting({ fontSize: s })}
                className={`flex-1 py-2 rounded-lg text-[12px] font-medium border transition-colors capitalize ${
                  (fmt.fontSize || "medium") === s
                    ? "border-slate-800 bg-slate-800 text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
