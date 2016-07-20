const expect = require('chai').expect;

const fs = require('fs');
const path = require('path');

const extractVersions = require('../../../js/grammars/version-page');

var versionLinksPageHTMLPath = path.join(__dirname, '..', '..', 'resources', 'version-page.html');
var versionLinksHTML = fs.readFileSync(versionLinksPageHTMLPath);

describe('extractVersions', function () {

  describe('when given a page of version links', function () {
    const NUM_LINKS = 32;
    const NUM_DUD_LINKS = 3;

    const FIRST_LINK_HOST = 'thevideo.me';
    const FIRST_LINK_VIEWS = 6342;
    const FIRST_LINK_RATING = 3.67;
    const FIRST_LINK_URL = '/external.php?title=The+Bachelor&url=aHR0cDovL3RoZXZpZGVvLm1lL2NwOWE4Ym9qcGdmYg==&domain=dGhldmlkZW8ubWU=&loggedin=0';

    it('returns an array', function () {
      expect(extractVersions(versionLinksHTML)).to.be.an('array');
    });

    it('returns an entry for each non-dud url', function () {
      expect(extractVersions(versionLinksHTML)).to.have.length(NUM_LINKS - NUM_DUD_LINKS);
    });

    it('parses the host, url, views and ratings fields', function () {
      const firstLink = extractVersions(versionLinksHTML)[0];
      expect(firstLink).to.have.property('host', FIRST_LINK_HOST);
      expect(firstLink).to.have.property('views', FIRST_LINK_VIEWS);
      expect(firstLink).to.have.property('rating', FIRST_LINK_RATING);
      expect(firstLink).to.have.property('url', FIRST_LINK_URL);
    });
  });
});