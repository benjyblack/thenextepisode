class Series {
  constructor(name, seasons = []) {
    this.name = name;
    this.collection = seasons;

    if (this.collection.length) {
      this.idx = 0;
    } else {
      this.idx = -1;
    }
  }
}

module.exports = Series;