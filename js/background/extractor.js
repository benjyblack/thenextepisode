const extractSeries = require('./../grammars/series-page');
const extractVersions = require('./../grammars/version-page');

class Extractor {
  constructor(fetcher) {
    this._fetcher = fetcher;
  }

  extractSeries(url) {
    return this._fetcher(url)
      .then(extractSeries);
  }

  extractVersions(url) {
    return this._fetcher(url)
      .then(extractVersions);
  }
};

module.exports = Extractor;