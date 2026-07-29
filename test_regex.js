const lines = [
  "· Lead end-to-end programmatic",
  "• Manage a 30+",
  "˚ Advise senior clients",
  "° Ensure governance",
  "◦ Enhance and enforce",
  "Led end-to-end"
];

for (const line of lines) {
  let match = line.match(/^[-*•·◦▪■●○–—]\s*(.*)/) || line.match(/^[^a-zA-Z0-9\s"'\(\[\{]\s+(.*)/);
  console.log(`${line.charAt(0)} -> match? ${!!match}`);
}
