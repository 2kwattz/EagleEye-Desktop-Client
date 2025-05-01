const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const { chromium } = require('playwright'); // Using Playwright for scraping

const DesktopClient = express();
const PORT = 3000;

// Serve static files from the screens folder
DesktopClient.use(express.static(path.join(__dirname, 'screens')));
runScraper(); 
// Route for '/'
DesktopClient.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens', 'index.html'));
  runScraper();  // Run scraper every time the homepage is loaded
});

// Start the Express server
DesktopClient.listen(PORT, () => {
  console.log(`EagleEye Desktop Client listening at http://localhost:${PORT}`);
});

// Create an invisible Electron window that won't show in the taskbar
function createWindow() {
  const win = new BrowserWindow({
    // skipTaskbar: true,         // Skip showing the window in taskbar
  });

  // Load the express server (which serves the HTML)
  win.loadURL(`http://localhost:${PORT}`);
}

// Scraper function using Playwright
async function runScraper() {
  try {
    // Launching Playwright in non-headless mode but invisible to the user
    const browser = await chromium.launch({
      headless: false, // Running headful, but we make the window invisible
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=-32000,-32000', // Move the browser window off-screen
      ],
    });

    const page = await browser.newPage();

    // Go to the target URL
    await page.goto('https://www.airnavradar.com/@23.03004,68.31800,z8'); // Change the URL to your target page

    // Perform scraping logic
    const data = await page.evaluate(() => {
      return document.querySelector('h1').innerText; // Scraping an example <h1> tag
    });

    console.log('Scraped Data:', data);

    await browser.close(); // Close the browser after scraping
  } catch (error) {
    console.error('Scraping failed:', error);
  }
}

// Launch Electron App
app.whenReady().then(() => {
  createWindow(); // Start the Electron window (but keep it hidden from taskbar)
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
