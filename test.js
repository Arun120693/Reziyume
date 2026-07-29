const html1 = "<p>* Lead a 30+ member cross-functional team</p><p>* Oversaw end-to-end</p>";
const html2 = "<ul><li>* Lead a 30+</li></ul>";
const html3 = "* Lead a 30+\n* Oversaw";

const cleanDescription = (html) => {
  if (!html) return "";
  let clean = html;
  
  // Strip ALL html tags EXCEPT ul, ol, li, p, br, b, i, strong, em, u
  // Actually, let's just forcefully find bullets anywhere.
  // Replace anything that looks like a bullet at the start of a paragraph or new line.
  
  // Convert <br> to \n for easier processing if there are no other block tags
  if (clean.includes('<br')) {
      clean = clean.replace(/<br\s*\/?>/gi, '\n');
  }

  // Case 1: Plain text or mixed text with newlines
  if (!clean.includes('<li>')) {
      // Remove all <p> tags but keep their newlines
      clean = clean.replace(/<\/p>\s*<p[^>]*>/gi, '\n');
      clean = clean.replace(/<\/?p[^>]*>/gi, '');
      
      const lines = clean.split('\n');
      let inList = false;
      let newHtml = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const match = trimmed.match(/^[-*•]\s*(.*)/);
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
  
  // Case 2: Already has <li> but they contain literal * or -
  if (clean.includes('<li>')) {
      clean = clean.replace(/<li>\s*[-*•]\s*(.*?)<\/li>/g, '<li>$1</li>');
  }
  
  return clean;
};

console.log("HTML1:", cleanDescription(html1));
console.log("HTML2:", cleanDescription(html2));
console.log("HTML3:", cleanDescription(html3));
