const StorageInterface = require('./../shared/storage-interface');
const extractSeries = require('./../grammars/series-page');
const extractVersions = require('./../grammars/version-page');
const fetchHTML = require('../utility/fetch-html');

const storageInterface = new StorageInterface();

storageInterface.init().then(() => {
  console.info('StorageInterface initialized');

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.action) {
      case 'extract-series': {
        handleExtractSeries(request.url);
        break;
      }
      case 'extract-versions': {
        handleExtractVersions(request.url, sendResponse);
        break;
      }
      default: {
        console.warn(`Unknown action ${request.action}`);
      }
    }
  });
});

const handleExtractSeries = (url) => {
  return fetchHTML(url)
    .then(extractSeries)
    .then(storageInterface.addOrUpdateSeries.bind(storageInterface))
    .then((extractedSeries) => {
      console.log(`${extractedSeries.name} added to local storage.`);
    });
}

const handleExtractVersions = (url, sendResponse) => {
  return fetchHTML(url)
    .then(extractVersions)
    .then(sendResponse);
};