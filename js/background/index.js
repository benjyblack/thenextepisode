const StorageInterface = require('./../shared/storage-interface');
const fetchHTML = require('../utility/fetch-html');
const Controller = require('./controller');

new Controller(
  new StorageInterface(),
  fetchHTML,
  chrome.runtime.onMessage
).init();