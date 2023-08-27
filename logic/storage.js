const ElectronStore = require("electron-store");
const storage = new ElectronStore();

const kUserDataPath = '';

function get(key) {
    return storage.get(key);
}

function set(key, value) {
    storage.set(key, value);
}

module.exports = {
    get,
    set,
    // Ids
    kUserDataPath,
};