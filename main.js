const {app, BrowserWindow} = require('electron')
const ElectronStore = require('electron-store');
const config = require('./logic/config');

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

    win.loadFile('index.html').then(r => {
        win.webContents.openDevTools();
    });
}

app.whenReady().then(() => {
    config.Path.userDataPath = app.getPath('userData');
    createWindow();
});