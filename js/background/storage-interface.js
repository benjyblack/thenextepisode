const {STORAGE_NAME} = require('../shared/constants');

const Container = require('../models/container');

function getContainer() {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_NAME, (localStorage) => {
      if (!localStorage ||
          !localStorage[STORAGE_NAME]) {
        return resolve(new Container());
      } else {
        return resolve(Container.fromRaw(localStorage[STORAGE_NAME]));
      }
    });
  });
};

function saveContainer(container) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_NAME]: container }, resolve);
  });
};

module.exports = {
  getContainer,
  saveContainer
};