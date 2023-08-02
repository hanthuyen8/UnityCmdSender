const { exec } = require('child_process');
const commandExists = require('command-exists');
const ElectronStore = require('electron-store');

const adbError = `Cannot get adb path!`;
const storage = new ElectronStore();

function setPackageName() {
  var selector = document.getElementById('packageSelector');
  var packageNameInput = document.getElementById('packageName');

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

  const adbPath = document.getElementById('adbPath').value.trim();
  const packageName = document.getElementById('packageName').value.trim();
  const cmd = document.getElementById('cmd').value.trim();
  const data = document.getElementById('data').value.trim();

  if (adbPath == '' || packageName == '' || cmd == '' || data == '') {
    alert('Please fill all fields!');
    document.getElementById('runBtn').disabled = false;
    return;
  }
  if (adbPath == adbError) {
    alert('Please enter correct adb path!');
    document.getElementById('runBtn').disabled = false;
    return;
  }

  const shellCommand = `${adbPath} shell am broadcast -n "${packageName}/com.senspark.unity_cmd_receiver.UnityCmdReceiver" -a com.senspark.ACTION_CMD -e cmd ${cmd} -e data \\"${data}\\"`;

  exec(shellCommand, (error, stdout, stderr) => {
    document.getElementById('runBtn').disabled = false;

    if (error) {
      alert(`error: ${error.message} `);
      return;
    }

    if (stderr) {
      alert(`stderr: ${stderr} `);
      return;
    }

    alert(`Command executed successfully!`);
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