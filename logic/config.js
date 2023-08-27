const path = require("path");
const storage = require("./storage");
require('dotenv').config()

const DataFolderName = "Data";

// Lấy ra resource path tuỳ theo hệ điều hành
function getResourcePath() {
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = "production";
    } else if (process.env.NODE_ENV === "development") {
        return __dirname;
    }
    return process.resourcesPath;
}

function getDataFolderPath() {
    return path.join(storage.get(storage.kUserDataPath), DataFolderName);
}

module.exports = {
    getResourcePath,
    getDataFolderPath,
};
