const _ = require('lodash');

const TV_EPISODE_SELECTOR = '.tv_episode_item:not(".transp2")';
const TV_EPISODE_NAME_SELECTOR = '.tv_episode_name';
const TV_EPISODE_NAME_PREFIX = ' - ';
const TV_SERIES_TITLE_SELECTOR = '.choose_tabs > h1 > span';

module.exports = ($) => {
  const seriesName = $(TV_SERIES_TITLE_SELECTOR).text().split(' ').slice(0, -1).join(' ');

  const episodes = _.map($(TV_EPISODE_SELECTOR), function (el) {
    const url = $(el).find('a').attr('href');

    const rawEpisodeName = $(el).find(TV_EPISODE_NAME_SELECTOR).text();
    const name = _sanitizeEpisodeName(rawEpisodeName);

    const number = _getEpisodeNumber(url);

    return { url, name, number};
  });

  const separatedBySeason = _.groupBy(episodes, function (episode) {
    return _.last(episode.url.match(/\/(season-\d+)/));
  });

  const withSeasonNumbersAdded = _.map(separatedBySeason, function (val, key) {
    return {
      number: parseInt(_.last(key.split('-')), 10),
      episodes: val
    };
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