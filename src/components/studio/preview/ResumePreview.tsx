"use client";
import { useRef, useState, useEffect } from "react";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { CoreTemplate } from "./templates/CoreTemplate";
import { getTemplateConfig } from "./templates/registry";

export function ResumePreview() {
  const data = useResumeStore((state) => state.data);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(1123); // Default to one A4 page height

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Calculate scale based on container width vs standard A4 width (794px)
        const newScale = entry.contentRect.width / 794;
        setScale(newScale);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    const contentObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContentHeight(Math.max(1123, entry.contentRect.height));
      }
    });
    contentObserver.observe(contentRef.current);
    return () => contentObserver.disconnect();
  }, []);

  if (!data) return null;

  const config = getTemplateConfig(data.templateId);

  return (
    <div 
      ref={containerRef}
      className="w-full relative print:shadow-none print:w-[210mm]"
      style={{ height: `${contentHeight * scale}px` }}
    >
      <div 
        ref={contentRef}
        className="origin-top-left absolute top-0 left-0 bg-white shadow-xl flex flex-col"
        style={{
          width: '794px',
          minHeight: '1123px',
          transform: `scale(${scale})`,
        }}
      >
        <CoreTemplate data={data} config={config} />
      </div>
    </div>
  );
}
