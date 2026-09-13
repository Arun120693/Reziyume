"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { templates } from "./preview/templates/registry";

const COLORS = ["#233d64", "#294c3e", "#264bb0", "#623f55", "#a44e32", "#7c3aed", "#0d9488", "#18181b"];
const FONTS = [
  { label: "Modern sans", value: "Inter, sans-serif" },
  { label: "Classic serif", value: "Georgia, serif" },
  { label: "Clean Arial", value: "Arial, sans-serif" },
  { label: "Traditional Times", value: "Times New Roman, serif" },
  { label: "Technical mono", value: "Courier New, monospace" },
];

export function CustomizePanel() {
  const data = useResumeStore(s => s.data);
  const updateFormatting = useResumeStore(s => s.updateFormatting);
  const updateTemplateId = useResumeStore(s => s.updateTemplateId);
  if (!data) return null;
  const fmt = data.formatting;
  const fieldClass = "w-full border border-stone-200 rounded-lg px-3 py-3 text-sm bg-white mt-2";
  return <div className="p-5 space-y-5">
    <div><p className="text-xs uppercase tracking-widest text-stone-500">Make it yours</p><h2 className="text-xl font-semibold mt-1">Small details. Big difference.</h2><p className="text-sm text-stone-500 mt-2">Your changes appear in the preview and save automatically.</p></div>
    <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-5">
      <label className="block text-sm font-semibold">Template<select className={fieldClass} value={templates.some(t => t.id === data.templateId) ? data.templateId : "onyx"} onChange={e => updateTemplateId(e.target.value)}>{templates.map(t => <option key={t.id} value={t.id}>{t.name} · {t.category}</option>)}</select></label>
      <label className="block text-sm font-semibold">Body font<select className={fieldClass} value={fmt.fontFamily} onChange={e => updateFormatting({ fontFamily:e.target.value })}>{!FONTS.some(f => f.value === fmt.fontFamily) && <option value={fmt.fontFamily}>{fmt.fontFamily}</option>}{FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select></label>
      <label className="block text-sm font-semibold">Text size<select className={fieldClass} value={fmt.fontSize} onChange={e => updateFormatting({ fontSize:e.target.value })}><option value="small">Small · more content</option><option value="medium">Medium · balanced</option><option value="large">Large · easier reading</option></select></label>
      <label className="block text-sm font-semibold">Page margins<select className={fieldClass} value={fmt.margins} onChange={e => updateFormatting({ margins:e.target.value })}><option value="narrow">Narrow</option><option value="normal">Standard</option><option value="wide">Generous</option></select></label>
      <fieldset><legend className="text-sm font-semibold mb-3">Accent color</legend><div className="flex flex-wrap gap-3">{COLORS.map(color => <button key={color} aria-label={`Accent color ${color}`} aria-pressed={fmt.accentColor === color} onClick={() => updateFormatting({ accentColor:color })} className="w-8 h-8 rounded-full border-2 border-white shadow-sm outline-offset-2" style={{backgroundColor:color, outline:fmt.accentColor === color ? `2px solid ${color}` : undefined}} />)}</div><div className="flex items-center justify-between mt-4"><label className="flex items-center gap-2 text-xs text-stone-600">Custom color<input aria-label="Custom accent color" type="color" value={fmt.accentColor || templates.find(t => t.id === data.templateId)?.colors.primary || "#18181b"} onChange={e => updateFormatting({accentColor:e.target.value})} className="h-8 w-9 cursor-pointer"/></label><button className="text-xs underline text-stone-600" onClick={() => updateFormatting({accentColor:""})}>Reset to template</button></div></fieldset>
    </div>
    <p className="text-xs leading-relaxed text-stone-500">Use the Content tab to reorder sections or add experience, education, projects, and more.</p>
  </div>;
}
