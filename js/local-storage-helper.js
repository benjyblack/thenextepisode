export const getFromStorage = (name) => {
  return new Promise(function (resolve) {
    chrome.storage.local.get(name, function () {
      return resolve(...arguments);
    });
  });
};

export const setInStorage = (obj) => {
  return new Promise(function (resolve) {
    chrome.storage.local.set(obj, function () {
      return resolve(...arguments);
    });
  });
};