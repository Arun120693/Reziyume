const fs = require("fs");
const text = fs.readFileSync("/Users/arun-personal/.gemini/antigravity-ide/brain/9533ba0e-20fa-468f-af73-43a2ba0b2ca9/.system_generated/logs/transcript.jsonl", "utf8");
const lines = text.split("\n").filter(Boolean);
for (const l of lines) {
  try {
    const obj = JSON.parse(l);
    if (obj.tool_calls) {
      for (const tc of obj.tool_calls) {
        if (tc.name === "multi_replace_file_content" && tc.args.TargetFile && tc.args.TargetFile.includes("ResumeStudio.tsx")) {
           console.log("----- REPLACEMENT -----");
           console.log(tc.args.ReplacementChunks);
        }
      }
    }
  } catch(e) {}
}
