const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Wait until the network is mostly idle to ensure data/images are loaded
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // Save the screenshot
  const screenshotPath = 'C:\\Users\\ashur\\.gemini\\antigravity-ide\\brain\\f13b68e0-d2c9-4582-9e55-8f1cc2b4b44b\\scratch\\layout.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log(`Screenshot saved to ${screenshotPath}`);
  await browser.close();
})();
