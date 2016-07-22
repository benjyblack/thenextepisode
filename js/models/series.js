class Series {
  constructor(name, seasons = []) {
    this.name = name;
    this.seasons = seasons;

    if (this.seasons.length) {
      this._currSeasonIdx = 0;
    } else {
      this._currSeasonIdx = -1;
    }
  }

  getCurrentSeason() {
    return this.seasons[this._currSeasonIdx];
  }

  nextSeason() {
    this._currSeasonIdx = (this._currSeasonIdx + 1) % this.seasons.length;
    
    return this.getCurrentSeason();
  }

  prevSeason() {
    if (--this._currSeasonIdx < 0) {
      this._currSeasonIdx = this.seasons.length - 1;
    }

    return this.getCurrentSeason();
  }
}

module.exports = Series;