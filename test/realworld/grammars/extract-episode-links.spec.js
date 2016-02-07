const fetch = require('isomorphic-fetch');
const extractEpisodeLinks = require('../../../js/grammars/extract-episode-links');

describe('extractEpisodeLinks', function () {

  const PRIMEWIRE_URL = 'http://www.primewire.ag/tv-368495-The-Bachelor/season-20-episode-2';
  let episodeLinksHTML;

  before(() => {
    return fetch(PRIMEWIRE_URL).then((response) => {
      return response.text();
    }).then((html) => {
      episodeLinksHTML = html;
    });
  });

  describe('when given a page of episode links', function () {
    it('returns an array', function () {
      expect(extractEpisodeLinks(episodeLinksHTML)).to.be.an('array');
    });

    it('returns at least a few entries', function () {
      expect(extractEpisodeLinks(episodeLinksHTML)).to.have.length.greaterThan(0);
    });

    it('parses the host, url, views and ratings fields', function () {
      const firstLink = extractEpisodeLinks(episodeLinksHTML)[0];
      expect(firstLink).to.have.property('host');
      expect(firstLink).to.have.property('views');
      expect(firstLink).to.have.property('rating');
      expect(firstLink).to.have.property('url');
    });
  });

});