const { exec } = require('child_process');
const commandExists = require('command-exists');
const ElectronStore = require('electron-store');

const adbError = `Cannot get adb path!`;
const storage = new ElectronStore();

function setPackageName() {
  const selector = document.getElementById('packageSelector');
  const packageNameInput = document.getElementById('packageName');

  packageNameInput.value = selector.value;
}

function getAdbPath() {
  const adbPath = storage.get('adbPath');
  if (adbPath) {
    return;
  }
  commandExists('adb').then(function () {
    document.getElementById('adbPath').value = `adb`;
  }).catch(function () {
    document.getElementById('adbPath').value = adbError;
  });
}

function runCommand() {
  document.getElementById('runBtn').disabled = true;
  document.getElementById('error').innerText = '';

  const adbPath = document.getElementById('adbPath').value.trim();
  const packageName = document.getElementById('packageName').value.trim();
  const cmd = document.getElementById('cmd').value.trim();
  const data = document.getElementById('data').value.trim();

  if (adbPath === '' || packageName === '' || cmd === '' || data === '') {
    const err = document.getElementById('error');
    err.innerText = 'Phải điền đủ các ô!';
    err.className = "error";

    document.getElementById('runBtn').disabled = false;
    return;
  }
  if (adbPath === adbError) {
    const err = document.getElementById('error');
    err.innerText = 'Adb path không hợp lệ!';
    err.className = "error";

    document.getElementById('runBtn').disabled = false;
    return;
  }

  const shellCommand = `${adbPath} shell am broadcast -n "${packageName}/com.senspark.unity_cmd_receiver.UnityCmdReceiver" -a com.senspark.ACTION_CMD -e cmd ${cmd} -e data \\"${data}\\"`;

  exec(shellCommand, (error, stdout, stderr) => {
    document.getElementById('runBtn').disabled = false;

    if (error) {
      const err = document.getElementById('error');
      err.innerText = `Error: ${error.message}`;
      err.className = "error";
      return;
    }

    if (stderr) {
      const err = document.getElementById('error');
      err.innerText = `Error: ${stderr}`;
      err.className = "error";
      return;
    }

    const err = document.getElementById('error');
    err.innerText = `Hoàn thành!`;
    err.className = "success";
    saveData();
  });
}

function loadData() {
  const adbPath = storage.get('adbPath');
  const packageName = storage.get('packageName');
  const cmd = storage.get('cmd');
  const data = storage.get('data');

  document.getElementById('adbPath').value = adbPath;
  document.getElementById('packageName').value = packageName ? packageName : '';
  document.getElementById('cmd').value = cmd;
  document.getElementById('data').value = data;
}

function saveData() {
  const adbPath = document.getElementById('adbPath').value.trim();
  const packageName = document.getElementById('packageName').value.trim();
  const cmd = document.getElementById('cmd').value.trim();
  const data = document.getElementById('data').value.trim();
  storage.set('adbPath', adbPath);
  storage.set('packageName', packageName);
  storage.set('cmd', cmd);
  storage.set('data', data);
}