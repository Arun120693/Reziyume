"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { CoreTemplate } from "@/components/studio/preview/templates/CoreTemplate";
import { templates, TemplateConfig } from "@/components/studio/preview/templates/registry";
import { dummyResumeData } from "@/lib/dummyData";

export function TemplateThumbnail({ template }: { template: TemplateConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 794));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="template-sheet" role="img" aria-label={`${template.name} resume preview`}>
    <div aria-hidden="true" className="pointer-events-none origin-top-left" style={{ width: 794, transform: `scale(${scale})` }}>
      <CoreTemplate data={{ ...dummyResumeData, templateId: template.id, formatting: { ...dummyResumeData.formatting, accentColor: "" } }} config={template} />
    </div>
  </div>;
}

export function TemplateGallery() {
  const [category, setCategory] = useState("All styles");
  const categories = ["All styles", "Professional", "Minimalist", "Modern", "Creative"];
  const shown = templates.filter(t => t.featured && (category === "All styles" || t.category === category));
  return <>
    <div className="gallery-filters" aria-label="Filter templates">{categories.map(c => <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)} className={c === category ? "selected" : ""}>{c}</button>)}</div>
    <div className="marketing-template-grid">{shown.map((t, i) => <Link href="/dashboard/templates" key={t.id} className="marketing-template-card">
      <div className={`template-mat mat-${i % 3}`}><TemplateThumbnail template={t} /><span className="template-open"><ArrowUpRight size={20} /></span></div>
      <div className="template-caption"><h3>{t.name}</h3><span>{t.category}</span></div>
      <p>{t.recommendedFor?.join(" · ")}</p>
    </Link>)}</div>
    <div className="gallery-cta"><Link href="/dashboard/templates" className="button-text">Explore all templates <ArrowUpRight size={18}/></Link><span>All current templates included free · Fictional sample content</span></div><p className="gallery-note"><Check size={16} /> Switch templates in the editor without retyping your story.</p>
  </>;
}
