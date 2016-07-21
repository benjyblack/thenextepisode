const StorageInterface = require('../shared/storage-interface');

class NavigationState {
  constructor() {
    this.currentSeriesIndex = -1;
    this.currentSeasonIndex = -1;
    this.currentEpisodeIndex = -1;

    /** 
     * maintain cached DB state so that we don't have to
     * continuously perform async checks against local
     * storage
     */
    this._allSeriesCached = [];
  }

  get series() {
    return this._allSeriesCached[this.currentSeriesIndex];
  }

  get season() {
    return this.series.seasons[this.currentSeasonIndex];
  }

  get episode() {
    return this.season.episodes[this.currentEpisodeIndex];
  }

  init() {
    return this.sync().then(() => {
      if (this._allSeriesCached.length) {
        this.currentSeriesIndex = 0;
        this.currentSeasonIndex = 0;
        this.currentEpisodeIndex = 0;
      }
    });
  }

  sync() {
    return StorageInterface.getAllSeries().then((db) => {
      this._allSeriesCached = db;
    });
  }

  goToNextSeries() {
    this.currentSeriesIndex = (this.currentSeriesIndex + 1) % this._allSeriesCached.length;
    this._resetSeriesIndices();
    return this.series;
  }

  goToPreviousSeries() {
    if (--this.currentSeriesIndex < 0) {
      this.currentSeriesIndex = this._allSeriesCached.length - 1;
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