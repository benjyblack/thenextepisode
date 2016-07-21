const _ = require('lodash');
const cheerio = require('cheerio');

const Series = require('../models/series');
const Season = require('../models/season');
const Episode = require('../models/episode');

const {
  TV_SERIES_TITLE_SELECTOR,
  TV_EPISODE_SELECTOR,
  TV_EPISODE_NAME_SELECTOR,
  TV_EPISODE_NAME_PREFIX
} = require('../shared/constants');

module.exports = (html) => {
  const $ = cheerio.load(html);

  const seriesName = $(TV_SERIES_TITLE_SELECTOR).text().split(' ').slice(0, -1).join(' ');

  const episodes = _.map($(TV_EPISODE_SELECTOR), (el) => {
    const url = $(el).find('a').attr('href');
    const rawEpisodeName = $(el).find(TV_EPISODE_NAME_SELECTOR).text();
    const name = _sanitizeEpisodeName(rawEpisodeName);
    const number = _getEpisodeNumber(url);

    return new Episode(name, number, url);
  });

  const seasons = _.chain(episodes)
    .groupBy((episode) => _.last(episode.url.match(/\/(season-\d+)/)))
    .map((episodes, key) => {
      const number = parseInt(_.last(key.split('-')), 10);

      return new Season(number, episodes);  
    })
    .value();

  return new Series(seriesName, seasons);
};

const _getEpisodeDetailsFromUrl = function (url) {
  return _.last(url.split('/'));
};

const _getEpisodeNumber = function (url) {
  return parseInt(_.last(_getEpisodeDetailsFromUrl(url).split('-')), 10);
};

const _sanitizeEpisodeName = function (rawEpisodeName) {
  return rawEpisodeName.slice(TV_EPISODE_NAME_PREFIX.length).trim();
};