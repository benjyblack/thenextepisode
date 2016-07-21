const STORAGE_NAME = 'TheNextEpisode - Series';
const STORAGE_INITIAL_STATE = [];

const getAllSeries = () => {
  return new Promise(function (resolve) {
    chrome.storage.local.get(STORAGE_NAME, function (allSeries) {
      if (!allSeries ||
          !allSeries[STORAGE_NAME]) {
        return resolve(STORAGE_INITIAL_STATE);
      }

      return resolve(allSeries[STORAGE_NAME]);
    });
  });
};

const setAllSeries = (updatedDB) => {
  return new Promise(function (resolve) {
    chrome.storage.local.set({ [STORAGE_NAME]: updatedDB }, function () {
      return resolve(...arguments);
    });
  });
};

const addOrUpdateSeries = (newSeries) => {
  return getAllSeries().then(function (existingSeries) {
    const indexOfSeries = _.findIndex(existingSeries, { name: newSeries.name });

    if (indexOfSeries === -1) {
      return setAllSeries([
        ...existingSeries,
        newSeries
      ]);
    }

    return setAllSeries([
      ...existingSeries.slice(0, indexOfSeries),
      newSeries,
      ...existingSeries.slice(indexOfSeries + 1)
    ]);
  });
};

module.exports = {
  getAllSeries,
  setAllSeries,
  addOrUpdateSeries
};