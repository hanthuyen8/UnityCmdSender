const htmlReader = require('./htmlReader').Helper;
const path = require('path');
const config = require('./config');
const fs = require('fs');

// Set Package name vào UI
function setPackageName() {
    const pkgSelector = htmlReader.getPackageSelector()
    const packageNameInput = htmlReader.getPackageNameInput();
    packageNameInput.value = pkgSelector.value;
    loadSampleCmdData();
}

// Đọc file lệnh mẫu từ thư mục
function loadSampleCmdData() {
    const pkgSelector = htmlReader.getPackageSelector();
    const infoDiv = htmlReader.getCmdSelectorDiv();

    try {
        const filePath = path.join(config.getDataFolderPath(), `${pkgSelector.value}.json`);
        console.log(filePath);
        if (!fs.existsSync(filePath)) {
            console.log('path not existed');
            infoDiv.className = htmlReader.kClassHidden;
            return;
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);

        const cmdSelector = htmlReader.getCmdSelector();
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
        infoDiv.className = htmlReader.kClassVisible;
    } catch (e) {
        infoDiv.className = htmlReader.kClassHidden;
        console.log(e.message);
    }
}

// Set Lệnh mẫu vào UI
function setSampleCmd() {
    try {
        const cmdSelector = document.getElementById(htmlReader.kIdCmdSelector);
        const data = cmdSelector.value;
        console.log(data);
        const json = JSON.parse(data);
        document.getElementById(htmlReader.kIdCmdTxt).value = json.cmd;
        document.getElementById(htmlReader.kIdDataTxt).value = json.sample;
    } catch (e) {
        console.log(e.message);
    }
}

module.exports.Utils = {
    setPackageName,
};