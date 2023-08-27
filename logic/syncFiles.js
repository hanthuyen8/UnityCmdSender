const fs = require('fs');
const path = require('path');

const config = require('./config');
const reader = require('./htmlReader');

module.exports.SyncFile = {
    fetchDataFile,
};

function fetchDataFile(onCompleted) {
    const packageName = reader.Helper.getPackageValue();
    const fileName = `${packageName}.json`;
    const host = `https://app-test.bombcrypto.io/nhanc18/unity_cmd_sender/`;
    const requestPath = `${host}${fileName}`;
    const saveFolderPath = config.getDataFolderPath();
    const saveFilePath = path.join(saveFolderPath, fileName);

    fetch(requestPath)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const uint8Array = new Uint8Array(buffer);

            if (!fs.existsSync(saveFolderPath)) {
                fs.mkdirSync(saveFolderPath, {recursive: true});
            }
            fs.writeFile(saveFilePath, uint8Array, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`Saved ${fileName} to ${saveFilePath}`);
                if (onCompleted) {
                    onCompleted(true);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            if (onCompleted) {
                onCompleted(false);
            }
        });
}