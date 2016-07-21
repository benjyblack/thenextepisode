const NavigationState = require('./navigation-state');
const StorageInterface = require('./../shared/storage-interface');
const extractSeries = require('./../grammars/series-page');
const fetchHTML = require('../utility/fetch-html');

const storageInterface = new StorageInterface();
// const navigationState = new NavigationState();

storageInterface.init().then(() => {
  console.info('StorageInterface initialized');

  chrome.runtime.onMessage.addListener((request) => {
    switch(request.action) {
      case 'extract-series': {
        handleExtractSeries(request.url);
        break;
      }
      default: {
        console.warn(`Unknown action ${request.action}`);
      }
    }
  });
});

// navigationState.init().then(() => {
//   console.log('NavigationState loaded');
// });

const handleExtractSeries = (url) => {
  return fetchHTML(url)
    .then(extractSeries)
    .then(storageInterface.addOrUpdateSeries.bind(storageInterface))
    .then((extractedSeries) => {
      console.log(`${extractedSeries.name} added to local storage.`);
      
      // navigationState.sync();
    });
}