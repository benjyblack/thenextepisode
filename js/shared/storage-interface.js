const STORAGE_NAME = 'TheNextEpisode';

const Container = require('../models/container');
const Series = require('../models/series');
const Season = require('../models/season');
const Episode = require('../models/episode');

class StorageInterface {
  constructor() {
    this._db = null;
  }

  init() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_NAME, (localStorage) => {
        if (!localStorage ||
            !localStorage[STORAGE_NAME]) {

          this._db = new Container();
        } else {
          this._db = localStorage[STORAGE_NAME];
        }

        return resolve(this._db);
      });
    });
  }

  getDB() {
    return this._db;
  }

  save() {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_NAME]: this._db }, resolve);
    });
  }

  addOrUpdateSeries(series) {
    const hydratedSeries = this._hydrateSeries(series);
    const idxOfSeries = _.findIndex(this._db.allSeries, { name: hydratedSeries.name });

    if (idxOfSeries === -1) {
      this._db.allSeries = [
        ...this._db.allSeries,
        hydratedSeries
      ];
    } else {
      this._db.allSeries = [
        ...this._db.allSeries.slice(0, idxOfSeries),
        hydratedSeries,
        ...this._db.allSeries.slice(idxOfSeries + 1)
      ];
    }

    return this.save().then(() => hydratedSeries);
  }

  _hydrateSeries(series) {
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
  }
}

module.exports = StorageInterface;