const _ = require('lodash');

function next(container) {
  return Object.assign({}, container, {
    idx: (container.idx + 1) % container.collection.length
  });
}

function prev(container) {
  return Object.assign({}, container, {
    idx: --container.idx < 0 ?
      container.collection.length - 1 :
      container.idx
  });
}

function current(container) {
  return container.collection[container.idx];
}

function addOrUpdate(container, item, predicate) {
  const idxOfItem = _.findIndex(container.collection, predicate);

  return Object.assign({}, container, {
    collection: idxOfItem === -1 ?
      [...container.collection, item] :
      [
        ...container.collection.slice(0, idxOfItem),
        item,
        ...container.collection.slice(idxOfItem + 1)
      ]
  });
}

module.exports = {next, prev, current, addOrUpdate};