import html2canvas from "html2canvas";

/** Capture the preview without letting Tailwind's image reset shift text baselines. */
export async function captureResume(element: HTMLElement) {
  const metricsStyle = document.createElement("style");
  // html2canvas measures font baselines with a temporary 1px image appended to
  // the document body. Preflight makes that image block-level, placing it on a
  // new line and shifting all captured text downward. Only reset that probe;
  // resume photos retain their own layout.
  metricsStyle.textContent = 'body > div > img[width="1"][height="1"] { display: inline !important; }';
  document.head.appendChild(metricsStyle);
  try {
    await document.fonts.ready;
    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
    });
  } finally {
    metricsStyle.remove();
  }
}
