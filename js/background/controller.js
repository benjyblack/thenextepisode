const extractSeries = require('./../grammars/series-page');
const extractVersions = require('./../grammars/version-page');
const {BASE_URL} = require('../shared/constants');

class Controller {
  constructor(storageInterface, fetcher, messagePasser) {
    this._storageInterface = storageInterface;
    this._fetcher = fetcher;
    this._messagePasser = messagePasser;
    
    this._messagePasser.addListener(this.handleMessage.bind(this));
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
    return Promise.all([
      this._fetcher(url).then(extractSeries),
      this._storageInterface.getContainer()
    ]).then(([extractedSeries, container]) => {
      return this._storageInterface.saveContainer(container.addOrUpdateSeries(extractedSeries));
    });
  }

  _handleExtractVersions(url, sendResponse) {
    return this._fetcher(url)
      .then(extractVersions)
      .then(sendResponse);  
  }

  _handleGetViewModel(sendResponse) {
    const container = this._storageInterface.getContainer().then((container) => {
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
    });
  }

  _handleNavigate(model, direction, sendResponse) {
    return this._storageInterface.getContainer((container) => {
      container[direction + model]();

      return this._storageInterface.saveContainer(container);
    }).then(() => handleGetViewModel(sendResponse));
  }

  _save(transformFunc) {
    return this._storageInterface.getContainer((container) => {
      return this._storageInterface.saveContainer(transformFunc(container));
    });
  }
}

module.exports = Controller;