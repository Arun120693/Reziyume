export type Band = { top: number; bottom: number };
/** Each source pixel belongs to exactly one page. Never repeat a heading. */
export function planPages(height: number, capacity: number, protectedBands: Band[]): number[] {
  if (height <= 0 || capacity < 1) throw new Error("Invalid page dimensions");
  const bands = protectedBands.filter(b => b.bottom > b.top).sort((a,b) => a.top - b.top);
  const cuts = [0];
  while (cuts[cuts.length - 1] < height) {
    const start = cuts[cuts.length - 1];
    let end = Math.min(height, start + Math.floor(capacity));
    if (end < height) {
      // Moving a cut can intersect text in another column; repeat until clear.
      let moved = true;
      while (moved) {
        moved = false;
        for (const band of bands) {
          if (band.top < end && band.bottom > end) { end = Math.floor(band.top); moved = true; break; }
        }
      }
      if (end <= start) throw new Error("This layout contains an element taller than a page. Use the text PDF option or reduce the font size.");
    }
    cuts.push(end);
  }
  return cuts;
}

export function measureProtectedBands(element: HTMLElement): Band[] {
  const root = element.getBoundingClientRect();
  const bands: Band[] = [];
  function lines(node: Node): DOMRect[] {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const rects: DOMRect[] = [];
    let text: Node | null;
    while ((text = walker.nextNode())) {
      if (!text.textContent?.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(text);
      rects.push(...Array.from(range.getClientRects()).filter(r => r.width > 0 && r.height > 0));
    }
    return rects.sort((a,b) => a.top - b.top);
  }
  for (const rect of lines(element)) bands.push({ top: rect.top - root.top - 1, bottom: rect.bottom - root.top + 1 });
  element.querySelectorAll("img, svg").forEach(node => { const r = node.getBoundingClientRect(); if (r.height) bands.push({ top: r.top - root.top - 1, bottom: r.bottom - root.top + 1 }); });
  element.querySelectorAll('[data-resume-experience-item]').forEach(item => {
    const description = item.lastElementChild;
    const firstLines = description ? lines(description) : [];
    const first = firstLines[0];
    const second = firstLines.find(r => first && r.top > first.top + 2);
    // Keep designation, dates, company, and the opening two description lines together.
    const bottom = (second || first)?.bottom ?? item.getBoundingClientRect().bottom;
    bands.push({ top: item.getBoundingClientRect().top - root.top - 1, bottom: bottom - root.top + 1 });
  });
  element.querySelectorAll("h2,h3").forEach(heading => {
    const next = heading.nextElementSibling;
    const first = next && lines(next)[0];
    const rect = heading.getBoundingClientRect();
    bands.push({ top: rect.top - root.top - 1, bottom: (first?.bottom ?? rect.bottom) - root.top + 1 });
  });
  return bands;
}
