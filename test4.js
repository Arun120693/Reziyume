const html = `<p>˚ Lead end-to-end programmatic and biddable activations across Search, Social, and Programmatic for large global</p><p>accounts, ensuring consistent KPI achievement and error-free execution.</p><p>˚ Manage a 30+ member cross-functional team</p>`;

let clean = html;
clean = clean.replace(/<\/p>\s*<p[^>]*>/gi, '\n');
clean = clean.replace(/<\/?p[^>]*>/gi, '');

const lines = clean.split('\n');
let inList = false;
let newHtml = '';
for (const line of lines) {
  let trimmed = line.trim();
  if (!trimmed) continue;
  trimmed = trimmed.replace(/^(?:&middot;|&bull;|&#183;|&#8226;)/i, '·');
  const match = trimmed.match(/^[-*•·◦▪■●○–—]\s*(.*)/) || trimmed.match(/^[^a-zA-Z0-9\s"'\(\[\{]\s+(.*)/);
  if (match) {
    if (!inList) { newHtml += '<ul>'; inList = true; }
    else { newHtml += '</li>'; }
    newHtml += `<li>${match[1]}`;
  } else {
    if (inList) { 
      newHtml += ` ${trimmed}`;
    } else {
      newHtml += `<p>${trimmed}</p>`;
    }
  }
}
if (inList) newHtml += '</li></ul>';
console.log(newHtml);
