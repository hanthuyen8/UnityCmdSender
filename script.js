const {exec} = require('child_process');
const commandExists = require('command-exists');
const ElectronStore = require('electron-store');
const fs = require('fs')

const adbError = `Cannot get adb path!`;
const storage = new ElectronStore();

const kIdDataTxt = 'data';
const kIdCmdTxt = 'cmd';
const kIdPkgNameTxt = 'packageName';
const kIdPkgSelector = 'packageSelector';
const kIdCmdSelector = 'cmdSelector';
const kIdCmdSelectorDiv = 'cmdSelectorDiv';
const kIdRunBtn = 'runBtn';
const kIdErrorDiv = 'error';
const kIdAdbPathTxt = 'adbPath';

const kClassError = 'error';
const kClassSuccess = 'success';
const kClassHidden = 'hidden';
const kClassVisible = 'visible';

function setPackageName() {
    const pkgSelector = document.getElementById(kIdPkgSelector);
    const packageNameInput = document.getElementById(kIdPkgNameTxt);

    packageNameInput.value = pkgSelector.value;

    loadSampleCmdData();
}

function loadSampleCmdData() {
    const pkgSelector = document.getElementById(kIdPkgSelector);
    const infoDiv = document.getElementById(kIdCmdSelectorDiv);

    try {
        const path = `./data/${pkgSelector.value}.json`;
        if (!fs.existsSync(path)) {
            infoDiv.className = kClassHidden;
            return;
        }
        const content = fs.readFileSync(path, 'utf-8');
        const json = JSON.parse(content);

        const cmdSelector = document.getElementById(kIdCmdSelector);
        cmdSelector.innerHTML = '';
        cmdSelector.onchange = setSampleCmd;

        const firstIt = document.createElement('option');
        firstIt.innerText = 'Select ...';
        cmdSelector.appendChild(firstIt);

        json.forEach(it => {
            const opt = document.createElement('option');
            opt.setAttribute('value', JSON.stringify(it));
            opt.innerText = it.desc;
            cmdSelector.appendChild(opt);
        });
        infoDiv.className = kClassVisible;
    } catch (e) {
        infoDiv.className = kClassHidden;
        console.log(e);
    }
}

function setSampleCmd() {
    try {
        const cmdSelector = document.getElementById(kIdCmdSelector);
        const data = cmdSelector.value;
        console.log(data);
        const json = JSON.parse(data);
        document.getElementById(kIdCmdTxt).value = json.cmd;
        document.getElementById(kIdDataTxt).value = json.sample;
    } catch (e) {
        console.log(e);
    }
}

function getAdbPath() {
    const adbPath = storage.get(kIdAdbPathTxt);
    if (adbPath) {
        return;
    }
    commandExists('adb').then(function () {
        document.getElementById(kIdAdbPathTxt).value = `adb`;
    }).catch(function () {
        document.getElementById(kIdAdbPathTxt).value = adbError;
    });
}

function runCommand() {
    document.getElementById(kIdRunBtn).disabled = true;
    document.getElementById(kIdErrorDiv).innerText = '';

    const adbPath = document.getElementById(kIdAdbPathTxt).value.trim();
    const packageName = document.getElementById(kIdPkgNameTxt).value.trim();
    const cmd = document.getElementById(kIdCmdTxt).value.trim();
    const data = document.getElementById(kIdDataTxt).value.trim();

    if (adbPath === '' || packageName === '' || cmd === '' || data === '') {
        setError('Phải điền đủ các ô!');
        document.getElementById(kIdRunBtn).disabled = false;
        return;
    }
    if (adbPath === adbError) {
        setError('Adb path không hợp lệ!');
        document.getElementById(kIdRunBtn).disabled = false;
        return;
    }

    const shellCommand = `${adbPath} shell am broadcast -n "${packageName}/com.senspark.unity_cmd_receiver.UnityCmdReceiver" -a com.senspark.ACTION_CMD -e cmd ${cmd} -e data \\"${data}\\"`;

    exec(shellCommand, (error, stdout, stderr) => {
        document.getElementById(kIdRunBtn).disabled = false;

        if (error) {
            setError(error.message);
            return;
        }

        if (stderr) {
            setError(stderr);
            return;
        }

        const err = document.getElementById(kIdErrorDiv);
        err.innerText = `Hoàn thành!`;
        err.className = kClassSuccess;
        saveData();
    });
}

function loadData() {
    const adbPath = storage.get(kIdAdbPathTxt);
    const packageName = storage.get(kIdPkgNameTxt);
    const cmd = storage.get(kIdCmdTxt);
    const data = storage.get(kIdDataTxt);

    document.getElementById(kIdAdbPathTxt).value = adbPath;
    document.getElementById(kIdPkgNameTxt).value = packageName ? packageName : '';
    document.getElementById(kIdCmdTxt).value = cmd;
    document.getElementById(kIdDataTxt).value = data;
}

function saveData() {
    const adbPath = document.getElementById(kIdAdbPathTxt).value.trim();
    const packageName = document.getElementById(kIdPkgNameTxt).value.trim();
    const cmd = document.getElementById(kIdCmdTxt).value.trim();
    const data = document.getElementById(kIdDataTxt).value.trim();
    storage.set(kIdAdbPathTxt, adbPath);
    storage.set(kIdPkgNameTxt, packageName);
    storage.set(kIdCmdTxt, cmd);
    storage.set(kIdDataTxt, data);
}

function setError(error) {
    const err = document.getElementById(kIdErrorDiv);
    err.innerText = `Error: ${error}`;
    err.className = kClassError;
}