const fs = require('fs');
const path = require('path');

const extractSeries = require('../../js/grammars/extract-series');

var seriesPageHTMLPath = path.join(__dirname, '..', 'resources', 'series-page.html');
var seriesPageHTML = fs.readFileSync(seriesPageHTMLPath);

describe('extractSeries', function () {

  describe('when given a series page', function () {
    const SERIES_NAME = 'The Bachelor';
    const NUM_SEASONS = 11;
    const FIRST_EP_NAME = 'Week One (S1)';

    it('returns an object', function () {
      expect(extractSeries(seriesPageHTML)).to.be.an('object');
    });

    it('parses the series name', function () {
      expect(extractSeries(seriesPageHTML)).to.have.property('name', SERIES_NAME);
    });

    it('parses all of the seasons', function () {
      expect(extractSeries(seriesPageHTML)).to.have.property('seasons').with.length(NUM_SEASONS);
    });

    it('parses each episode name', function () {
      const firstEp = extractSeries(seriesPageHTML).seasons[0].episodes[0];
      expect(firstEp).to.have.property('name', FIRST_EP_NAME);
    });
  });

});