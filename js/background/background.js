const StorageInterface = require('./../shared/storage-interface');
const extractSeries = require('./../grammars/series-page');
const extractVersions = require('./../grammars/version-page');
const fetchHTML = require('../utility/fetch-html');
const {BASE_URL} = require('../shared/constants');

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
      case 'get-view-model': {
        handleGetViewModel(sendResponse);
        break;
      }
      case 'navigation': {
        handleNavigation(request.model, request.direction, sendResponse);
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

const handleGetViewModel = (sendResponse) => {
  const container = storageInterface.getContainer();

  return fetchHTML(BASE_URL + container.getCurrentEpisode().url)
    .then(extractVersions)
    .then((extractedVersions) => {
      return sendResponse({
        series: container.getCurrentSeries().name,
        season: container.getCurrentSeason().number,
        episode: container.getCurrentEpisode().name,
        versions: extractedVersions
      });
    });
};

const handleNavigation = (model, direction, sendResponse) => {
  return storageInterface.navigate(model, direction).then(() => {
    return handleGetViewModel(sendResponse)
  });
};