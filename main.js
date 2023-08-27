const {app, BrowserWindow} = require('electron')
const ElectronStore = require('electron-store');
const config = require('./logic/config');
const storage = require('./logic/storage');

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
    const dataPath = app.getPath('userData');
    console.log(`userDataPath: ${dataPath}`);
    storage.set(storage.kUserDataPath, dataPath);
    createWindow();
});