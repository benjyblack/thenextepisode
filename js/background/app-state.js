const _ = require('lodash');

const DB = require('../shared/db');
const fetchHTML = require('../utility/fetch-html');
const extractEpisodeLinks = require('../grammars/extract-episode-links');
const { BASE_URL } = require('../shared/constants');

class AppState {
  constructor() {
    this._currentSeriesIndex = -1;
    this._currentSeasonIndex = -1;
    this._currentEpisodeIndex = -1;

    this._dbState = [];
  }

  get currentSeriesIndex() {
    return this._currentSeriesIndex;
  }

  get currentSeasonIndex() {
    return this._currentSeasonIndex;
  }

  get currentEpisodeIndex() {
    return this._currentEpisodeIndex;
  }

  set currentSeriesIndex(newVal) {
    this._currentSeriesIndex = newVal;
  }

  set currentSeasonIndex(val) {
    this._currentSeasonIndex = val;
  }

  set currentEpisodeIndex(val) {
    this._currentEpisodeIndex = val;
  }

  get series() {
    return this._dbState[this.currentSeriesIndex];
  }

  get season() {
    return this.series.seasons[this.currentSeasonIndex];
  }

  get episode() {
    return this.season.episodes[this.currentEpisodeIndex];
  }

  init() {
    return DB.boot().then((db) => {
      this._dbState = db;

      if (this._dbState.length) {
        this.currentSeriesIndex = 0;
        this.currentSeasonIndex = 0;
        this.currentEpisodeIndex = 0;
      }
    });
  }

  sync() {
    return DB.get().then((db) => {
      this._dbState = db;
    });
  }

  getNextSeries() {
    this.currentSeriesIndex = (this.currentSeriesIndex + 1) % this._dbState.length;
    this._resetSeriesIndices();
    return this.series;
  }

  getPreviousSeries() {
    if (--this.currentSeriesIndex < 0) {
      this.currentSeriesIndex = this._dbState.length - 1;
    }
    this._resetSeriesIndices();
    return this.series;
  }

  _resetSeriesIndices() {
    this.currentSeasonIndex = 0;
    this.currentEpisodeIndex = 0;
  }

  getNextSeason() {
    this.currentSeasonIndex = (this.currentSeasonIndex + 1) % this.series.seasons.length;
    this._resetSeasonIndices();
    return this.season;
  }

  getPreviousSeason() {
    if (--this.currentSeasonIndex < 0) {
      this.currentSeasonIndex = this.series.seasons.length - 1;
    }
    this._resetSeasonIndices();
    return this.season;
  }

  _resetSeasonIndices() {
    this.currentEpisodeIndex = 0;
  }

  getNextEpisode() {
    this.currentEpisodeIndex = (this.currentEpisodeIndex + 1) % this.season.episodes.length;
    return this.episode;
  }

  getPreviousEpisode() {
    if (--this.currentEpisodeIndex < 0) {
      this.currentEpisodeIndex = this.season.episodes.length - 1;
    }
    return this.episode;
  }

  getEpisodeLinks(url) {
    return fetchHTML(`${BASE_URL}${url}`).then((htmlResponse) => {
      return extractEpisodeLinks(htmlResponse);
    }).then((links) => {
      return _.sortBy(links, 'views').reverse();
    });
  }
}

module.exports = AppState;