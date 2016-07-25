const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-factories'));
require('../../resources/factories');

const Container = require('../../../js/models/container');

describe('Container:', () => {
  it('can be initialized', () => {
    expect(Container.init()).to.be.an('object');
  });

  describe('iteration:', () => {
    const SAMPLE_CONTAINER = chai.create('container', {
      collection: [chai.create('series'), chai.create('series')]
    });

    describe('series:', () => {
      it('can be incremented to the next series', () => {
        expect(Container.nextSeries(SAMPLE_CONTAINER)).to.have.property('idx', 1);
      });

      it('can be decremented to the previous series', () => {
        expect(Container.prevSeries(SAMPLE_CONTAINER)).to.have.property('idx', 1);
      });
    });

    describe('seasons:', () => {
      const SAMPLE_SERIES = chai.create('series', {
        collection: [
          chai.create('season', { number: 0 }),
          chai.create('season', { number: 1 })
        ]
      });

      const SAMPLE_CONTAINER = chai.create('container', {
        collection: [SAMPLE_SERIES]
      });

      it('can be incremented to the next season', () => {
        const updatedContainer = Container.nextSeason(SAMPLE_CONTAINER);
        expect(Container.getCurrentSeason(updatedContainer)).to.have.property('number', 1);
      });

      it('can be decremented to the previous season', () => {
        const updatedContainer = Container.prevSeason(SAMPLE_CONTAINER);
        expect(Container.getCurrentSeason(updatedContainer)).to.have.property('number', 1);
      });
    });

    describe('episodes:', () => {
      const SAMPLE_SEASON = chai.create('season', {
        collection: [
          chai.create('episode', { number: 0 }),
          chai.create('episode', { number: 1 })
        ]
      });

      const SAMPLE_SERIES = chai.create('series', {
        collection: [SAMPLE_SEASON]
      });

      const SAMPLE_CONTAINER = chai.create('container', {
        collection: [SAMPLE_SERIES]
      });

      it('can be incremented to the next episode', () => {
        const updatedContainer = Container.nextEpisode(SAMPLE_CONTAINER);
        expect(Container.getCurrentEpisode(updatedContainer)).to.have.property('number', 1);
      });

      it('can be decremented to the previous episode', () => {
        const updatedContainer = Container.prevEpisode(SAMPLE_CONTAINER);
        expect(Container.getCurrentEpisode(updatedContainer)).to.have.property('number', 1);
      });
    });
  });
});