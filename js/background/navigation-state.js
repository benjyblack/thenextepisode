const DB = require('../shared/db');

class NavigationState {
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

  goToNextSeries() {
    this.currentSeriesIndex = (this.currentSeriesIndex + 1) % this._dbState.length;
    this._resetSeriesIndices();
    return this.series;
  }

  goToPreviousSeries() {
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

  goToNextSeason() {
    this.currentSeasonIndex = (this.currentSeasonIndex + 1) % this.series.seasons.length;
    this._resetSeasonIndices();
    return this.season;
  }

  goToPreviousSeason() {
    if (--this.currentSeasonIndex < 0) {
      this.currentSeasonIndex = this.series.seasons.length - 1;
    }
    this._resetSeasonIndices();
    return this.season;
  }

  _resetSeasonIndices() {
    this.currentEpisodeIndex = 0;
  }

  goToNextEpisode() {
    this.currentEpisodeIndex = (this.currentEpisodeIndex + 1) % this.season.episodes.length;
    return this.episode;
  }

  goToPreviousEpisode() {
    if (--this.currentEpisodeIndex < 0) {
      this.currentEpisodeIndex = this.season.episodes.length - 1;
    }
    return this.episode;
  }
}

module.exports = NavigationState;