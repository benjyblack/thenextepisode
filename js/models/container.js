const Series = require('./series');
const Season = require('./season');
const Episode = require('./episode');

const iterator = require('../lib/iterator');

function init(allSeries = []) {
  return {
    collection: allSeries,
    idx: allSeries.length ? 0 : -1
  };
}

function initFromRaw(rawContainer) {
  const series = container.allSeries.map((series) => {
    const seasons = series.seasons.map((season) => {
      const episodes = season.episodes.map((episodeObj) => {
        return new Episode(
          episodeObj.name,
          episodeObj.number,
          episodeObj.url
        );
      });

      return new Season(
        season.number,
        episodes
      );
    });
    
    return new Series(
      series.name,
      seasons
    );
  });

  return Object.assign(rawContainer, {
    collection: series
  });
}

function getCurrentSeries(container) {
  return iterator.current(container);
}

function getCurrentSeason(container) {
  return iterator.current(getCurrentSeries(container));
}

function getCurrentEpisode(container) {
  return iterator.current(getCurrentSeason(container));
}

function nextSeries(container) {
  return iterator.next(container);
}

function prevSeries(container) {
  return iterator.prev(container);
}

function nextSeason(container) {
  return _updateSeries(container, iterator.next(getCurrentSeries(container)));
}

function prevSeason(container) {
  return _updateSeries(container, iterator.prev(getCurrentSeries(container)));
}

function _updateSeries(container, updatedSeries) {
  return iterator.addOrUpdate(container, updatedSeries, { name: updatedSeries.name }) 
}

function nextEpisode(container) {
  return _updateSeason(container, iterator.next(getCurrentSeason(container)));
}

function prevEpisode(container) {
  return _updateSeason(container, iterator.prev(getCurrentSeason(container)));
}

function _updateSeason(container, updatedSeason) {
  const currentSeries = getCurrentSeries(container);
  const updatedSeries = iterator.addOrUpdate(currentSeries, updatedSeason, { number: updatedSeason.number });

  return _updateSeries(container, updatedSeries);
}

module.exports = {
  init, initFromRaw,
  getCurrentSeries, nextSeries, prevSeries,
  getCurrentSeason, nextSeason, prevSeason,
  getCurrentEpisode, nextEpisode, prevEpisode
};