const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('store', {
    get: key => ipcRenderer.invoke('get-store-data', key),
    set: (key, value) => ipcRenderer.invoke('set-store-data', key, value)
});
