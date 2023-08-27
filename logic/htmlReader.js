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

function getPackageValue() {
    const pkgSelector = document.getElementById(kIdPkgSelector);
    return pkgSelector.value;
}

function getPackageSelector() {
    return document.getElementById(kIdPkgSelector);
}

function getPackageNameInput() {
    return document.getElementById(kIdPkgNameTxt);
}

function getCmdSelectorDiv() {
    return document.getElementById(kIdCmdSelectorDiv);
}

function getCmdSelector() {
    return document.getElementById(kIdCmdSelector);
}

const Helper = {
    // Functions
    getPackageValue,
    getPackageSelector,
    getPackageNameInput,
    getCmdSelectorDiv,
    getCmdSelector,
    // IDs
    kIdDataTxt,
    kIdCmdTxt,
    kIdPkgNameTxt,
    kIdPkgSelector,
    kIdCmdSelector,
    kIdCmdSelectorDiv,
    kIdRunBtn,
    kIdErrorDiv,
    kIdAdbPathTxt,
    // Classes
    kClassError,
    kClassSuccess,
    kClassHidden,
    kClassVisible,
};

module.exports.Helper = Helper;