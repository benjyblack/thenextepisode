class Season {
  constructor(number, episodes = []) {
    this.number = number;
    this.episodes = episodes;

    if (this.episodes.length) {
      this._currEpisodeIdx = 0;
    } else {
      this._currEpisodeIdx = -1;
    }
  }
}

module.exports = Season;