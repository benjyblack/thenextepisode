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

  getCurrentEpisode() {
    return this.episodes[this._currEpisodeIdx];
  }

  nextEpisode() {
    this._currEpisodeIdx = (this._currEpisodeIdx + 1) % this.episodes.length;
    
    return this.getCurrentSeason();
  }

  prevEpisode() {
    if (--this._currEpisodeIdx < 0) {
      this._currEpisodeIdx = this.episodes.length - 1;
    }

    return this.getCurrentEpisode();
  }
}

module.exports = Season;