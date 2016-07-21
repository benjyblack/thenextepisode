const NavigationState = require('./navigation-state');
const storageInterface = require('./../shared/storage-interface');
const extractSeries = require('./../grammars/series-page');
const fetchHTML = require('../utility/fetch-html');

const navigationState = new NavigationState();

navigationState.init().then(() => {
  console.log('NavigationState loaded');
});

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

const handleExtractSeries = (url) => {
  return fetchHTML(url)
    .then(extractSeries)
    .then(storageInterface.addOrUpdateSeries)
    .then((extractedSeries) => {
      console.log(`${extractedSeries.name} added to local storage.`);
      
      navigationState.sync();
    });
}