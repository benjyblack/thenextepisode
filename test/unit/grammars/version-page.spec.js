const expect = require('chai').expect;

const fs = require('fs');
const path = require('path');

const Version = require('../../../js/models/version');
const extractVersions = require('../../../js/grammars/version-page');

var versionLinksPageHTMLPath = path.join(__dirname, '..', '..', 'resources', 'version-page.html');
var versionLinksHTML = fs.readFileSync(versionLinksPageHTMLPath);

describe('versionPage', function () {

  describe('when given a page of version links', function () {
    const NUM_LINKS = 32;
    const NUM_SPAM_LINKS = 3;

    const FIRST_LINK_HOST = 'thevideo.me';
    const FIRST_LINK_VIEWS = 6342;
    const FIRST_LINK_RATING = 3.67;
    const FIRST_LINK_URL = '/external.php?title=The+Bachelor&url=aHR0cDovL3RoZXZpZGVvLm1lL2NwOWE4Ym9qcGdmYg==&domain=dGhldmlkZW8ubWU=&loggedin=0';

    it('returns an array of Version objects', function () {
      const extractedVersions = extractVersions(versionLinksHTML);
      extractedVersions.forEach((version) =>
        expect(version).to.be.an.instanceOf(Version)
      );
    });

    it('returns a Version for each non-spam url', function () {
      expect(extractVersions(versionLinksHTML)).to.have.length(NUM_LINKS - NUM_SPAM_LINKS);
    });

    it('parses the host, url, views and ratings fields', function () {
      const firstVersion = extractVersions(versionLinksHTML)[0];
      expect(firstVersion).to.deep.equal({
        host: FIRST_LINK_HOST,
        views: FIRST_LINK_VIEWS,
        rating: FIRST_LINK_RATING,
        url: FIRST_LINK_URL
      });
    });
  });
});