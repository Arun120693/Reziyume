/** Split one complete opening paragraph/bullet without duplicating any content. */
export function splitLead(html: string): [string, string] {
  const list = html.match(/^\s*<(ul|ol)[^>]*>\s*(<li\b[^>]*>[\s\S]*?<\/li>)([\s\S]*)$/i);
  if (list) return [`<${list[1]}>${list[2]}</${list[1]}>`, `<${list[1]}>${list[3]}`];
  const paragraph = html.match(/^\s*(<p\b[^>]*>[\s\S]*?<\/p>)([\s\S]*)$/i);
  if (paragraph) return [paragraph[1], paragraph[2]];
  return [html, ""];
}
