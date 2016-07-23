const {STORAGE_NAME} = require('../shared/constants');

const Container = require('../models/container');
const Series = require('../models/series');
const Season = require('../models/season');
const Episode = require('../models/episode');

function getContainer() {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_NAME, (localStorage) => {
      if (!localStorage ||
          !localStorage[STORAGE_NAME]) {
        return resolve(new Container());
      } else {
        return resolve(toModel(localStorage[STORAGE_NAME]));
      }
    });
  });
};

function saveContainer(container) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_NAME]: container }, resolve);
  });
};

function addOrUpdateSeries(series) {
  return getContainer().then((container) => {
    const idxOfSeries = _.findIndex(container.allSeries, { name: series.name });

    if (idxOfSeries === -1) {
      container.allSeries = [
        ...container.allSeries,
        series
      ];
    } else {
      container.allSeries = [
        ...container.allSeries.slice(0, idxOfSeries),
        series,
        ...container.allSeries.slice(idxOfSeries + 1)
      ];
    }

    return saveContainer(container).then(() => series);
  });
}

function navigate(model, direction) {
  return getContainer().then((container) => {
    container[direction + model()];
    return saveContainer(container);
  });
}

module.exports = {
  getContainer,
  saveContainer,
  addOrUpdateSeries,
  navigate
};

function toModel(container) {
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

  return new Container(series);
}