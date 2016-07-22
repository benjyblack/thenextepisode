class Container {
  constructor(allSeries = []) {
    this.allSeries = allSeries;

    if (this.allSeries.length) {
      this._currSeriesIdx = 0;
    } else {
      this._currSeriesIdx = -1;
    }
  }

  getCurrentSeries() {
    return this.allSeries[this._currSeriesIdx];
  }

  nextSeries() {
    this._currSeriesIdx = (this._currSeriesIdx + 1) % this.allSeries.length;
    
    return this.getCurrentSeries();
  }

  prevSeries() {
    if (--this._currSeriesIdx < 0) {
      this._currSeriesIdx = this.allSeries.length - 1;
    }

    return this.getCurrentSeries();
  }

  getCurrentSeason() {
    return this.getCurrentSeries().getCurrentSeason();
  }

  nextSeason() {
    return this.getCurrentSeries().nextSeason();
  }

  prevSeason() {
    return this.getCurrentSeries().prevSeason();
  }

  getCurrentEpisode() {
    return this.getCurrentSeason().getCurrentEpisode();
  }

  nextEpisode() {
    return this.getCurrentSeries().getCurrentSeason().nextEpisode();
  }

  prevEpisode() {
    return this.getCurrentSeries().getCurrentSeason().prevEpisode();
  }
}

module.exports = Container;