const _ = require('lodash');
const cheerio = require('cheerio');

const {
  TV_SERIES_TITLE_SELECTOR,
  TV_EPISODE_SELECTOR,
  TV_EPISODE_NAME_SELECTOR,
  TV_EPISODE_NAME_PREFIX
} = require('../shared/constants');

module.exports = (html) => {
  const $ = cheerio.load(html);
  const seriesName = $(TV_SERIES_TITLE_SELECTOR).text().split(' ').slice(0, -1).join(' ');

  const episodes = _.map($(TV_EPISODE_SELECTOR), function (el) {
    const url = $(el).find('a').attr('href');
    const rawEpisodeName = $(el).find(TV_EPISODE_NAME_SELECTOR).text();
    const name = _sanitizeEpisodeName(rawEpisodeName);
    const number = _getEpisodeNumber(url);

    return { url, name, number};
  });

  const seasons = _.groupBy(episodes, function (episode) {
    return _.last(episode.url.match(/\/(season-\d+)/));
  });

  const withSeasonNumbersAdded = _.map(seasons, function (episodes, key) {
    const number = parseInt(_.last(key.split('-')), 10);

    return { number, episodes };
  });

  return {
    name: seriesName,
    seasons: withSeasonNumbersAdded
  };
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