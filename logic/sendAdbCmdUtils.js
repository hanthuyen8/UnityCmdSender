const {exec} = require('child_process');
const ElectronStore = require("electron-store");
const commandExists = require('command-exists');
const storage = new ElectronStore();

const htmlReader = require('./htmlReader').Helper;

const adbError = `Cannot get adb path!`;

module.exports.Utils = {
    runCommand,
    loadUIData,
    setAdbPathToUI
}

// Chạy lệnh Adb
function runCommand() {
    document.getElementById(htmlReader.kIdRunBtn).disabled = true;
    document.getElementById(htmlReader.kIdErrorDiv).innerText = '';

    const adbPath = document.getElementById(htmlReader.kIdAdbPathTxt).value.trim();
    const packageName = document.getElementById(htmlReader.kIdPkgNameTxt).value.trim();
    const cmd = document.getElementById(htmlReader.kIdCmdTxt).value.trim();
    const data = document.getElementById(htmlReader.kIdDataTxt).value.trim();

    if (adbPath === '' || packageName === '' || cmd === '' || data === '') {
        setError('Phải điền đủ các ô!');
        document.getElementById(htmlReader.kIdRunBtn).disabled = false;
        return;
    }
    if (adbPath === adbError) {
        setError('Adb path không hợp lệ!');
        document.getElementById(htmlReader.kIdRunBtn).disabled = false;
        return;
    }

    const shellCommand = `${adbPath} shell am broadcast -n "${packageName}/com.senspark.unity_cmd_receiver.UnityCmdReceiver" -a com.senspark.ACTION_CMD -e cmd ${cmd} -e data \\"${data}\\"`;

    exec(shellCommand, (error, stdout, stderr) => {
        document.getElementById(htmlReader.kIdRunBtn).disabled = false;

        if (error) {
            setError(error.message);
            return;
        }

        if (stderr) {
            setError(stderr);
            return;
        }

        const err = document.getElementById(htmlReader.kIdErrorDiv);
        err.innerText = `Hoàn thành!`;
        err.className = htmlReader.kClassSuccess;
        saveUIData();
    });
}

// Hiển thị Error message lên màn hình
function setError(error) {
    const err = document.getElementById(htmlReader.kIdErrorDiv);
    err.innerText = `Error: ${error}`;
    err.className = htmlReader.kClassError;
}

// Lưu data để auto complete cho lần sau
function saveUIData() {
    const adbPath = document.getElementById(htmlReader.kIdAdbPathTxt).value.trim();
    const packageName = document.getElementById(htmlReader.kIdPkgNameTxt).value.trim();
    const cmd = document.getElementById(htmlReader.kIdCmdTxt).value.trim();
    const data = document.getElementById(htmlReader.kIdDataTxt).value.trim();
    storage.set(htmlReader.kIdAdbPathTxt, adbPath);
    storage.set(htmlReader.kIdPkgNameTxt, packageName);
    storage.set(htmlReader.kIdCmdTxt, cmd);
    storage.set(htmlReader.kIdDataTxt, data);
}

// Lấy data auto complete đã lưu để hiển thị vào UI
function loadUIData() {
    const adbPath = storage.get(htmlReader.kIdAdbPathTxt);
    const packageName = storage.get(htmlReader.kIdPkgNameTxt);
    const cmd = storage.get(htmlReader.kIdCmdTxt);
    const data = storage.get(htmlReader.kIdDataTxt);

    document.getElementById(htmlReader.kIdAdbPathTxt).value = adbPath;
    document.getElementById(htmlReader.kIdPkgNameTxt).value = packageName ? packageName : '';
    document.getElementById(htmlReader.kIdCmdTxt).value = cmd;
    document.getElementById(htmlReader.kIdDataTxt).value = data;
}

// Set Adb path vào UI
function setAdbPathToUI() {
    const adbPath = storage.get(htmlReader.kIdAdbPathTxt);
    if (adbPath) {
        return;
    }
    commandExists('adb').then(function () {
        document.getElementById(htmlReader.kIdAdbPathTxt).value = `adb`;
    }).catch(function () {
        document.getElementById(htmlReader.kIdAdbPathTxt).value = adbError;
    });
}