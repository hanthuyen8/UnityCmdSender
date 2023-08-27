const syncFile = require('./logic/syncFiles');
const packageSelectorUtils = require('./logic/packageSelectorUtils').Utils;
const sendAdbCmdUtils = require('./logic/sendAdbCmdUtils').Utils;

function loadUIData() {
    sendAdbCmdUtils.setAdbPathToUI();
    sendAdbCmdUtils.loadUIData();
}

function fetchDataFile() {
    syncFile.SyncFile.fetchDataFile();
}

function setPackageName() {
    packageSelectorUtils.setPackageName();
}

function runCommand() {
    sendAdbCmdUtils.runCommand();
}