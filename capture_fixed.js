const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });
  
  // Login first if needed or assume we're logged in/cookies available.
  // Actually, the page might require login. Let's try navigating.
  await page.goto('http://localhost:3000/dashboard/studio/45e0d47d-9a52-47b8-ac2d-6f051205aeae', { waitUntil: 'networkidle2' });
  
  // Wait a moment for rendering
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: '/Users/arun-personal/.gemini/antigravity-ide/brain/9533ba0e-20fa-468f-af73-43a2ba0b2ca9/fixed_preview.png', fullPage: true });
  
  await browser.close();
  console.log("Screenshot saved.");
})();
