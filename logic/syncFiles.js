const fs = require('fs');
const path = require('path');

const config = require('./config');
const reader = require('./htmlReader');
const {Helper: htmlReader} = require("./htmlReader");

module.exports.SyncFile = {
    fetchDataFile,
};

const kLoadingText = 'Đang tải...';
const kIdleText = 'Kiểm tra';

// Tải cheat config file json data từ server về
async function fetchDataFile(onCompleted) {
    const packageName = reader.Helper.getPackageValue();
    const fileName = `${packageName}.json`;
    const host = `https://app-test.bombcrypto.io/nhanc18/unity_cmd_sender/`;
    const rand = Math.random() * 10000;
    const requestPath = `${host}${fileName}?p=${rand}`;
    const saveFolderPath = config.getDataFolderPath();
    const saveFilePath = path.join(saveFolderPath, fileName);

    setBtnText(kLoadingText);
    setError('');

    try {
        const response = await fetch(requestPath);
        if (!response.ok) {
            throw Error('Network error.');
        }
        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        if (!fs.existsSync(saveFolderPath)) {
            fs.mkdirSync(saveFolderPath, {recursive: true});
        }
        fs.writeFileSync(saveFilePath, uint8Array);

        console.log(`Saved ${fileName} to ${saveFilePath}`);
        setBtnText(kIdleText);
        if (onCompleted) {
            onCompleted(true);
        }
    } catch (error) {
        console.error('Error:', error);
        setBtnText(kIdleText);
        setError(error.message);
        if (onCompleted) {
            onCompleted(false);
        }
    }
}

function setBtnText(text) {
    document.getElementById(htmlReader.kIdFetchDataBtn).innerText = text;
}

function setError(text) {
    const err = document.getElementById(htmlReader.kIdErrorDiv);
    if (text === '') {
        err.innerText = '';
        err.className = htmlReader.kClassHidden;
    } else {
        err.innerText = `Error: ${text}`;
        err.className = htmlReader.kClassError;
    }
}