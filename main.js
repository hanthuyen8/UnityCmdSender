const {app, BrowserWindow} = require('electron')
const ElectronStore = require('electron-store');

function createWindow() {
    ElectronStore.initRenderer();

    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);