//export const retrieve = promisify(chrome.storage.local.get).bind(chrome.storage.local);
//export const store = promisify(chrome.storage.local.set).bind(chrome.storage.local);

export const retrieve = (name) => {
  return new Promise(function (resolve) {
    chrome.storage.local.get(name, function () {
      return resolve(...arguments);
    });
  });
};

export const store = (obj) => {
  return new Promise(function (resolve) {
    chrome.storage.local.set(obj, function () {
      return resolve(...arguments);
    });
  });
};

//function promisify(fun) {
//  return function (...args) {
//    var loadedFun = _.partial(fun, ...args);
//    return new Promise(function (resolve) {
//      loadedFun(function () {
//        resolve(...arguments);
//      });
//    });
//  };
//}