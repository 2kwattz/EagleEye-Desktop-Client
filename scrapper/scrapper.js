// scraper.js
const { chromium } = require('playwright');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await sleep(50000);
  await page.goto('https://example.com');

  const title = await page.title();
  console.log("Scraped title:", title);

  await browser.close();
})();
