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
      messagePasserStub,
      onMessageCallback;

  beforeEach(() => {
    fetcherMock = sinon.stub().resolves(seriesPageHTML);

    storageStub = {
      init: sinon.stub().resolves(),
      addOrUpdateSeries: sinon.stub().resolves({ name: 'Test' })
    };

    onMessageCallback = sinon.spy();

    messagePasserStub = {
      addListener: (callback) => {
        onMessageCallback = callback;
      }
    };

    controller = new Controller(storageStub, fetcherMock, messagePasserStub);

    return controller.init();
  });


  describe('reacting to messages', () => {

    describe('extract-series', () => {
      it('fetches the HTML from given URL', () => {
        const URL = 'http://url.com';

        return onMessageCallback({ action: 'extract-series', url: URL }).then(() => {
          expect(fetcherMock.calledWith(URL)).to.be.true;
        });
      });
    });
  });

});