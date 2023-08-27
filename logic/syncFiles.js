const fs = require('fs');
const path = require('path');

const config = require('./config');
const reader = require('./htmlReader');

function fetchDataFile() {
    const packageName = reader.Helper.getPackageValue();
    const fileName = `${packageName}.json`;
    const host = `https://app-test.bombcrypto.io/nhanc18/unity_cmd_sender/`;
    const requestPath = `${host}${fileName}`;
    const savePath = path.join(config.Path.userDataPath, config.DataFolderName, fileName);

    fetch(requestPath)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const uint8Array = new Uint8Array(buffer);

            fs.writeFile(savePath, uint8Array, (err) => {
                if (err) {
                    throw err;
                }
                console.log('The file has been saved!');
            });
        })
        .catch(error => console.error('Error:', error));
}

module.exports.SyncFile = {
    fetchDataFile,
};