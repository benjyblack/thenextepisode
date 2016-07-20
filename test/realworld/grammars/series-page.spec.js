const fetch = require('isomorphic-fetch');
const extractSeries = require('../../../js/grammars/series-page');

const PRIMEWIRE_URL = 'http://www.primewire.ag/tv-368495-The-Bachelor';

describe('extractSeries', function () {

  before(() => {
    return fetch(PRIMEWIRE_URL).then((response) => {
      return response.text();
    }).then((html) => {
      episodeLinksHTML = html;
    });
  });

  describe('when given a series page', function () {
    const SERIES_NAME = 'The Bachelor';
    const FIRST_EP_NAME = 'Week One (S1)';

    it('returns an object', function () {
      expect(extractSeries(seriesPageHTML)).to.be.an('object');
    });

    it('parses the series name', function () {
      expect(extractSeries(seriesPageHTML)).to.have.property('name', SERIES_NAME);
    });

    it('parses some seasons', function () {
      expect(extractSeries(seriesPageHTML)).to.have.property('seasons').with.length.greaterThan(0);
    });

    it('parses each episode name', function () {
      const firstEp = extractSeries(seriesPageHTML).seasons[0].episodes[0];
      expect(firstEp).to.have.property('name', FIRST_EP_NAME);
    });
  });

});