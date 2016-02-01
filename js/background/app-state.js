const DB = require('../shared/db');

class AppState {
  constructor() {
    this._currentIndices = {
      series: -1,
      season: -1,
      episode: -1
    };

    this._dbState = [];
  }

  get series() {
    return this._dbState[this._currentIndices.series];
  }

  get season() {
    return this.series.seasons[this._currentIndices.season];
  }

  get episode() {
    return this.season.episodes[this._currentIndices.episode];
  }

  init() {
    return DB.boot().then((db) => {
      this._dbState = db;

      if (this._dbState.length) {
        this._currentIndices.series = 0;
        this._currentIndices.season = 0;
        this._currentIndices.episode = 0;
      }
    });
  }

  sync() {
    return DB.get().then((db) => {
      this._dbState = db;
    });
  }

  getNextSeries() {
    this._currentIndices.series = (this._currentIndices.series + 1) % this._dbState.length;
    this._resetSeriesIndices();
    return this.series;
  }

  getPreviousSeries() {
    if (--this._currentIndices.series < 0) {
      this._currentIndices.series = this._dbState.length - 1;
    }
    this._resetSeriesIndices();
    return this.series;
  }

  _resetSeriesIndices() {
    this._currentIndices.season = 0;
    this._currentIndices.episode = 0;
  }

  getNextSeason() {
    this._currentIndices.season = (this._currentIndices.season + 1) % this.series.seasons.length;
    this._resetSeasonIndices();
    return this.season;
  }

  getPreviousSeason() {
    if (--this._currentIndices.season < 0) {
      this._currentIndices.season = this.series.seasons.length - 1;
    }
    this._resetSeasonIndices();
    return this.season;
  }

  _resetSeasonIndices() {
    this._currentIndices.episode = 0;
  }

  getNextEpisode() {
    this._currentIndices.episode = (this._currentIndices.episode + 1) % this.season.episodes.length;
    return this.episode;
  }

  getPreviousEpisode() {
    if (--this._currentIndices.episode < 0) {
      this._currentIndices.episode = this.season.episodes.length - 1;
    }
    return this.episode;
  }
}

module.exports = AppState;