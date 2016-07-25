class Season {
  constructor(number, episodes = []) {
    this.number = number;
    this.collection = episodes;

    if (this.collection.length) {
      this.idx = 0;
    } else {
      this.idx = -1;
    }
  }
}

module.exports = Season;