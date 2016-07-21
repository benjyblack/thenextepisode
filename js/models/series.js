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
}

module.exports = Series;