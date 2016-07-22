const Extractor = require('./extractor');
const {BASE_URL} = require('../shared/constants');

class Controller {
  constructor(storageInterface, fetcher, messagePasser) {
    this._storageInterface = storageInterface;
    this._extractor = new Extractor(fetcher);
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
    return this._extractor
      .extractSeries(url)
      .then(this._storageInterface.addOrUpdateSeries.bind(this._storageInterface))
      .then((extractedSeries) => {
        console.log(`${extractedSeries.name} added to local storage.`);
      });
  }

  _handleExtractVersions(url, sendResponse) {
    return this._extractor
      .extractVersions(url)
      .then(sendResponse);  
  }

  _handleGetViewModel(sendResponse) {
    const container = this._storageInterface.getContainer();

    return this._extractor
      .extractVersions(BASE_URL + container.getCurrentEpisode().url)
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