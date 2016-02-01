const DB_NAME = 'TheNextEpisode';
const DB_INITIAL_STATE = [];

const boot = () => {
  return get(DB_NAME).then(function (db) {
    // initialize DB if does not exist yet
    if (!db) {
      return set(DB_INITIAL_STATE).then(() => DB_INITIAL_STATE);
    }

    return db;
  });
};

const get = () => {
  return new Promise(function (resolve) {
    chrome.storage.local.get(DB_NAME, function (dbContainer) {
      return resolve(dbContainer[DB_NAME]);
    });
  });
};

const set = (updatedDB) => {
  return new Promise(function (resolve) {
    chrome.storage.local.set({ [DB_NAME]: updatedDB }, function () {
      return resolve(...arguments);
    });
  });
};

const addOrUpdate = (newSeries) => {
  return get().then(function (db) {
    const indexOfSeries = _.findIndex(db, { name: newSeries.name });

    if (indexOfSeries === -1) {
      return set([
        ...db,
        newSeries
      ]);
    }

    return set([
      ...db.slice(0, indexOfSeries),
      newSeries,
      ...db.slice(indexOfSeries + 1)
    ]);
  });
};

module.exports = {
  boot,
  get,
  set,
  addOrUpdate
};