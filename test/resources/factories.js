const chai = require('chai');

chai.factory('episode', {
  name: 'The Beach',
  number: 0,
  url: 'tv-2778963-The-Night-Of/season-1-episode-1'
});

chai.factory('season', {
  number: 0,
  idx: 0,
  collection: [chai.create('episode')]
});

chai.factory('series', { 
  name: 'The Night Of',
  idx: 0,
  collection: [chai.create('season')]
});

chai.factory('container', {
  idx: 0,
  collection: [chai.create('series')]
});