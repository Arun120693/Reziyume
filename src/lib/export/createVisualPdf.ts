import jsPDF from "jspdf";

const MAX_PDF_BYTES = 600_000;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/** Keep the preview design while fitting the last page to the actual content. */
export function createVisualPdf(source: HTMLCanvasElement): Blob {
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
      const pageCount = Math.max(1, Math.ceil((imageHeightMm - 0.01) / A4_HEIGHT_MM));
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });

      for (let page = 0; page < pageCount; page++) {
        const usedHeight = page * A4_HEIGHT_MM;
        const remainingHeight = imageHeightMm - usedHeight;
        const pageHeight = page === pageCount - 1
          ? Math.min(A4_HEIGHT_MM, Math.max(remainingHeight, 25))
          : A4_HEIGHT_MM;
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
