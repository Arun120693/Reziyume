import jsPDF from "jspdf";

const MAX_PDF_BYTES = 600_000;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/** Keep the preview design while fitting the last page to the actual content. */
export function createVisualPdf(source: HTMLCanvasElement, requestedBreaks: number[] = []): Blob {
  // JPEG avoids embedding the large, lossless PNG repeatedly. Reduce resolution
  // only when necessary to meet the download limit, including photos.
  for (const width of [source.width, 1200, 1000, 800, 640]) {
    const exportWidth = Math.min(width, source.width);
    const exportHeight = Math.max(1, Math.round(source.height * exportWidth / source.width));
    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare the PDF image");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, exportWidth, exportHeight);
    context.drawImage(source, 0, 0, exportWidth, exportHeight);

    for (const quality of [0.78, 0.65, 0.52, 0.4, 0.3, 0.2]) {
      const image = canvas.toDataURL("image/jpeg", quality);
      const imageHeightMm = exportHeight * A4_WIDTH_MM / exportWidth;
      const scale = exportWidth / source.width;
      const boundaries = [0, ...requestedBreaks.map((point) => point * scale).filter((point) => point > 0 && point < exportHeight), exportHeight]
        .sort((a, b) => a - b)
        .filter((point, index, values) => index === 0 || point - values[index - 1] > 2);
      const pageCount = Math.max(1, boundaries.length - 1);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });

      for (let page = 0; page < pageCount; page++) {
        const usedHeight = boundaries[page] * A4_WIDTH_MM / exportWidth;
        const pageHeight = Math.min(A4_HEIGHT_MM, Math.max((boundaries[page + 1] - boundaries[page]) * A4_WIDTH_MM / exportWidth, 25));
        const orientation = pageHeight < A4_WIDTH_MM ? "landscape" : "portrait";
        if (page > 0) pdf.addPage([A4_WIDTH_MM, pageHeight], orientation);
        else if (pageCount === 1 && pageHeight < A4_HEIGHT_MM) {
          pdf.deletePage(1);
          pdf.addPage([A4_WIDTH_MM, pageHeight], orientation);
        }
        pdf.addImage(image, "JPEG", 0, -usedHeight, A4_WIDTH_MM, imageHeightMm, undefined, "FAST");
      }

      const blob = pdf.output("blob");
      if (blob.size <= MAX_PDF_BYTES) return blob;
    }
  }
  throw new Error("This resume could not be exported under 600 KB. Try a smaller profile photo.");
}
