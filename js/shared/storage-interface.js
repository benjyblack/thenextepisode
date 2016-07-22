const {STORAGE_NAME} = require('../shared/constants');

const Container = require('../models/container');
const Series = require('../models/series');
const Season = require('../models/season');
const Episode = require('../models/episode');

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
          this._container = this._toModel(localStorage[STORAGE_NAME]);
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

  navigate(model, direction) {
    this._container[direction + model]();
    return this.save();
  }

  _toModel(storage) {
    const series = storage.allSeries.map((series) => {
      const seasons = series.seasons.map((season) => {
        const episodes = season.episodes.map((episodeObj) => {
          return new Episode(
            episodeObj.name,
            episodeObj.number,
            episodeObj.url
          );
        });

        return new Season(
          season.number,
          episodes
        );
      });
      
      return new Series(
        series.name,
        seasons
      );
    });

    return new Container(series);
  }
}

module.exports = StorageInterface;