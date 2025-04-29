const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

const DesktopClient = express();
const PORT = 3000;

// Express route
DesktopClient.get('/', (req, res) => {
  res.send('<h1>Hello from Express!</h1><p>Yes bro, this is running inside Electron.</p>');
});

// Start the Express server
DesktopClient.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`);
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

  // Load Express server URL into Electron window
  win.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
