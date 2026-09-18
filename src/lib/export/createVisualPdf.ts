import jsPDF from "jspdf";
import { Band, planPages } from "./pagination";

export type ExportOptions = { pageSize?: "a4" | "letter"; fit?: boolean; bands?: Band[]; measuredWidth?: number };
/** Crop disjoint source regions, rather than shifting a full image across pages. */
export function createVisualPdf(source: HTMLCanvasElement, options: ExportOptions = {}): Blob {
  const format = options.pageSize || "a4";
  const width = format === "a4" ? 210 : 215.9;
  const height = format === "a4" ? 297 : 279.4;
  const margin = 8;
  const usableWidth = width - 2 * margin;
  const usableHeight = height - 2 * margin;
  const scale = source.width / (options.measuredWidth || source.width);
  const capacity = source.width * usableHeight / usableWidth;
  const bands = (options.bands || []).map(b => ({ top: b.top * scale, bottom: b.bottom * scale }));
  const cuts = options.fit ? [0, source.height] : planPages(source.height, capacity, bands);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format, compress: true });
  for (let i = 0; i < cuts.length - 1; i++) {
    if (i) pdf.addPage(format);
    const sliceHeight = cuts[i + 1] - cuts[i];
    const canvas = document.createElement("canvas");
    canvas.width = source.width; canvas.height = sliceHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare PDF page");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, cuts[i], source.width, sliceHeight, 0, 0, source.width, sliceHeight);
    const ratio = Math.min(usableWidth / source.width, usableHeight / sliceHeight);
    const imageWidth = source.width * ratio;
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", (width - imageWidth) / 2, margin, imageWidth, sliceHeight * ratio, undefined, "FAST");
  }
  return pdf.output("blob");
}
