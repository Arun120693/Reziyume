const html1 = "<p>·Lead a 30+ member cross-functional team</p><p>·Oversaw end-to-end</p>";
const html2 = "<ul><li>· Lead a 30+</li></ul>";
const html3 = "• Lead a 30+\n• Oversaw";
const html4 = "* Lead a 30+";

const cleanDescription = (html) => {
  if (!html || typeof html !== 'string') return "";
  let clean = html;
  
  if (clean.includes('<br')) {
    clean = clean.replace(/<br\s*\/?>/gi, '\n');
  }

  if (!clean.includes('<li>')) {
    clean = clean.replace(/<\/p>\s*<p[^>]*>/gi, '\n');
    clean = clean.replace(/<\/?p[^>]*>/gi, '');
    
    const lines = clean.split('\n');
    let inList = false;
    let newHtml = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Added many bullet characters and made space optional
      const match = trimmed.match(/^[-*•·◦▪■●○–—]\s*(.*)/);
      if (match) {
        if (!inList) { newHtml += '<ul>'; inList = true; }
        newHtml += `<li>${match[1]}</li>`;
      } else {
        if (inList) { newHtml += '</ul>'; inList = false; }
        newHtml += `<p>${trimmed}</p>`;
      }
    }
    if (inList) newHtml += '</ul>';
    clean = newHtml || clean;
  }
  
  if (clean.includes('<li>')) {
    clean = clean.replace(/<li>\s*[-*•·◦▪■●○–—]\s*(.*?)<\/li>/g, '<li>$1</li>');
  }

  return clean;
};

console.log("HTML1:", cleanDescription(html1));
console.log("HTML2:", cleanDescription(html2));
console.log("HTML3:", cleanDescription(html3));
console.log("HTML4:", cleanDescription(html4));
