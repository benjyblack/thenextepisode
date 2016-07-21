const {STORAGE_NAME} = require('../shared/constants');

const Container = require('../models/container');

class StorageInterface {
  constructor() {
    this._container = null;
  }

  init() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_NAME, (localStorage) => {
        if (!localStorage ||
            !localStorage[STORAGE_NAME]) {

          this._container = new Container();
        } else {
          this._container = localStorage[STORAGE_NAME];
        }

        return resolve(this._container);
      });
    });
  }

  getContainer() {
    return this._container;
  }

  save() {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_NAME]: this._container }, resolve);
    });
  }

  addOrUpdateSeries(series) {
    const idxOfSeries = _.findIndex(this._container.allSeries, { name: series.name });

    if (idxOfSeries === -1) {
      this._container.allSeries = [
        ...this._container.allSeries,
        series
      ];
    } else {
      this._container.allSeries = [
        ...this._container.allSeries.slice(0, idxOfSeries),
        series,
        ...this._container.allSeries.slice(idxOfSeries + 1)
      ];
    }

    return this.save().then(() => series);
  }
}

module.exports = StorageInterface;