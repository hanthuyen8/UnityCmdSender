require('dotenv').config()

const DataFolderName = "Data";

const Path = {
    userDataPath: '',
};

// Lấy ra resource path tuỳ theo hệ điều hành
function getResourcePath() {
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = "production";
    } else if (process.env.NODE_ENV === "development") {
        return __dirname;
    }
    return process.resourcesPath;
}

module.exports.Config = {
    getResourcePath,
};
module.exports.DataFolderName = DataFolderName;
module.exports.Path = Path;