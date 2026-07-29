import fs from 'fs';
import pdf from 'pdf-parse';

async function test() {
  const dataBuffer = fs.readFileSync('/tmp/test_resume.pdf');
  try {
    const data = await pdf(dataBuffer);
    console.log("Success length:", data.text.length);
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
