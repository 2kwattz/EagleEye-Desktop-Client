const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

const DesktopClient = express();
const PORT = 3000;

// Serve static files from the screens folder
DesktopClient.use(express.static(path.join(__dirname, 'screens')));

// Route for '/'
DesktopClient.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens', 'index.html'));
});

// Start the Express server
DesktopClient.listen(PORT, () => {
  console.log(`EagleEye Desktop Client listening at http://localhost:${PORT}`);
});

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the express server (which serves the HTML)
  win.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
