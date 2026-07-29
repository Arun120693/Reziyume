import React from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function FormattingToolbar() {
  const formatting = useResumeStore((state) => state.data?.formatting);
  const updateFormatting = useResumeStore((state) => state.updateFormatting);

  if (!formatting) return null;

  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-200 bg-white shadow-sm shrink-0">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Font:</label>
        <select
          className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
          value={formatting.fontFamily}
          onChange={(e) => updateFormatting({ fontFamily: e.target.value })}
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="Merriweather, serif">Merriweather</option>
          <option value="'Roboto Mono', monospace">Roboto Mono</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Size:</label>
        <select
          className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
          value={formatting.fontSize}
          onChange={(e) => updateFormatting({ fontSize: e.target.value })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Margins:</label>
        <select
          className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
          value={formatting.margins}
          onChange={(e) => updateFormatting({ margins: e.target.value })}
        >
          <option value="narrow">Narrow</option>
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Accent:</label>
        <input
          type="color"
          className="w-8 h-8 rounded border-none cursor-pointer p-0 m-0 bg-transparent"
          value={formatting.accentColor}
          onChange={(e) => updateFormatting({ accentColor: e.target.value })}
        />
      </div>
    </div>
  );
}
