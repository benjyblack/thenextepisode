const extractSeries = require('./../grammars/series-page');
const extractVersions = require('./../grammars/version-page');
const {BASE_URL} = require('../shared/constants');

class Controller {
  constructor(storageInterface, fetcher, messagePasser) {
    this._storageInterface = storageInterface;
    this._fetcher = fetcher;
    this._messagePasser = messagePasser;
  }

  init() {
    return this._setupStorage().then(() => {
      return this._setupMessagePasser();
    });
  }

  _setupStorage() {
    return this._storageInterface.init().then(() => {
      console.info('StorageInterface initialized');
    });
  }

  _setupMessagePasser() {
    this._messagePasser.addListener((request, sender, sendResponse) => {
      switch(request.action) {
        case 'extract-series': {
          return this._handleExtractSeries(request.url);
          break;
        }
        case 'extract-versions': {
          return this._handleExtractVersions(request.url, sendResponse);
          break;
        }
        case 'get-view-model': {
          return this._handleGetViewModel(sendResponse);
          break;
        }
        case 'navigation': {
          return this._handleNavigation(request.model, request.direction, sendResponse);
          break;
        }
        default: {
          console.warn(`Unknown action ${request.action}`);
        }
      }
    });

    console.info('MessagePasser ready');
  }

  _handleExtractSeries(url) {
    return this._fetcher(url)
      .then(extractSeries)
      .then(this._storageInterface.addOrUpdateSeries.bind(this._storageInterface))
      .then((extractedSeries) => {
        console.log(`${extractedSeries.name} added to local storage.`);
      });
  }

  _handleExtractVersions(url, sendResponse) {
    return this._fetcher(url)
      .then(extractVersions)
      .then(sendResponse);  
  }

  _handleGetViewModel(sendResponse) {
    const container = this._storageInterface.getContainer();

    return this._fetcher(BASE_URL + container.getCurrentEpisode().url)
      .then(extractVersions)
      .then((extractedVersions) => {
        return sendResponse({
          series: container.getCurrentSeries().name,
          season: container.getCurrentSeason().number,
          episode: container.getCurrentEpisode().name,
          versions: extractedVersions
        });
      });
  }

  _handleNavigation(model, direction, sendResponse) {
    return this._storageInterface
      .navigate(model, direction)
      .then(() => {
        return handleGetViewModel(sendResponse)
      });
  }
}

module.exports = Controller;