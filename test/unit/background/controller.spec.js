const expect = require('chai').expect;
const sinon = require('sinon');
const sinonAsPromised = require('sinon-as-promised');

const fs = require('fs');
const path = require('path');

const seriesPageHTMLPath = path.join(__dirname, '..', '..', 'resources', 'series-page.html');
const seriesPageHTML = fs.readFileSync(seriesPageHTMLPath);

const Controller = require('../../../js/background/controller');

describe('Controller', () => {
  let controller,
      fetcherStub,
      storageStub,
      messagePasserStub;

  beforeEach(() => {
    fetcherStub = sinon.stub().resolves(seriesPageHTML);

    storageStub = {
      init: sinon.stub().resolves(),
      addOrUpdateSeries: sinon.stub().resolves({ name: 'Test' })
    };

    messagePasserStub = { addListener: sinon.spy() };

    controller = new Controller(storageStub, fetcherStub, messagePasserStub);

    return controller.init();
  });


  describe('reacting to messages', () => {

    describe('extract-series', () => {
      const URL = 'http://url.com';

      it('fetches the HTML from given URL', () => {
        return controller.handleMessage({ action: 'extract-and-persist-series', url: URL }).then(() => {
          expect(fetcherStub.calledWith(URL)).to.be.true;
        });
      });

      it('adds a series to storage', () => {
        return controller.handleMessage({ action: 'extract-and-persist-series', url: URL }).then(() => {
          expect(storageStub.addOrUpdateSeries.called).to.be.true;
        });
      });
    });
  });
});