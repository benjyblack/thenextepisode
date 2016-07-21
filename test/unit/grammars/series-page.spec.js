const expect = require('chai').expect;

const fs = require('fs');
const path = require('path');

const Series = require('../../../js/models/series');

const extractSeries = require('../../../js/grammars/series-page');

const seriesPageHTMLPath = path.join(__dirname, '..', '..', 'resources', 'series-page.html');
const seriesPageHTML = fs.readFileSync(seriesPageHTMLPath);

const SERIES_NAME = 'The Bachelor';
const NUM_SEASONS = 11;
const NUM_EPISODES = 98;
const FIRST_EP_NAME = 'Week One (S1)';

describe('seriesPage', function () {

  describe('when given a series page', function () {

    it('returns an object of type Series', function () {
      expect(extractSeries(seriesPageHTML)).to.be.an.instanceof(Series);
    });

    it('parses the series name', function () {
      expect(extractSeries(seriesPageHTML)).to.have.property('name', SERIES_NAME);
    });

    it('parses all of the seasons', function () {
      expect(extractSeries(seriesPageHTML)).to.have.property('seasons').with.length(NUM_SEASONS);
    });

    it('parses all of the episodes', function () {
      const extractedSeries = extractSeries(seriesPageHTML);
      const numEpisodesExtracted = extractedSeries.seasons.reduce((totalNumEps, nextSeason) => {
        return totalNumEps + nextSeason.episodes.length;
      }, 0);

      expect(numEpisodesExtracted).to.equal(NUM_EPISODES);
    });

    it('parses each episode name', function () {
      const firstEp = extractSeries(seriesPageHTML).seasons[0].episodes[0];
      expect(firstEp).to.have.property('name', FIRST_EP_NAME);
    });
  });

});