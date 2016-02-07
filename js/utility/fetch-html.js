const fetch = require('isomorphic-fetch');

module.exports = (url) => {
  return fetch(url).then((response) => {
    return response.text();
  });
}