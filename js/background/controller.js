const Extractor = require('./extractor');
const {BASE_URL} = require('../shared/constants');

class Controller {
  constructor(storageInterface, fetcher, messagePasser) {
    this._storageInterface = storageInterface;
    this._extractor = new Extractor(fetcher);
    this._messagePasser = messagePasser;
  }

  init() {
    return this._storageInterface.init().then(() => {
      console.info('StorageInterface initialized');
    }).then(() => {
      return this._messagePasser.addListener(this.handleMessage.bind(this));
      console.info('MessagePasser ready');
    });
  }

  handleMessage(request, sender, sendResponse) {
    switch(request.action) {
      case 'extract-and-persist-series': {
        return this._handleExtractAndPersistSeries(request.url).then((extractedSeries) => {
          console.log(`${extractedSeries.name} added to local storage.`);
        });
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
      case 'navigate': {
        return this._handleNavigate(request.model, request.direction, sendResponse);
        break;
      }
      default: {
        console.warn(`Unknown action ${request.action}`);
      }
    }
  }

  _handleExtractAndPersistSeries(url) {
    return this._extractor
      .extractSeries(url)
      .then((extractedSeries) =>
        this._storageInterface.addOrUpdateSeries(extractedSeries)
      );
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

  _handleNavigate(model, direction, sendResponse) {
    return this._storageInterface
      .navigate(model, direction)
      .then(() => handleGetViewModel(sendResponse));
  }
}

module.exports = Controller;