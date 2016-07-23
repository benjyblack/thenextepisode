const storageInterface = require('./storage-interface');
const fetchHTML = require('../utility/fetch-html');
const Controller = require('./controller');

new Controller(
  storageInterface,
  fetchHTML,
  chrome.runtime.onMessage
);