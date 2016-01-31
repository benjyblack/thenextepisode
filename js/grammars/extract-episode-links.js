const _ = require('lodash');
const cheerio = require('cheerio');

const {
  TV_EPISODE_LINK,
  TV_EPISODE_LINK_HOST,
  TV_EPISODE_LINK_URL,
  TV_EPISODE_LINK_RATING,
  TV_EPISODE_LINK_VIEWS,
  TV_EPISODE_LINK_SPAM
} = require('../shared/constants');

module.exports = (html) => {
  const $ = cheerio.load(html);

  const realLinks = _.reject($(TV_EPISODE_LINK), (link) => {
    const linkTag = $(link).find(TV_EPISODE_LINK_URL)[0];
    return $(linkTag).attr('onclick').match(TV_EPISODE_LINK_SPAM);
  });

  const parsedLinks = _.map(realLinks, (link) => {
    const host = $(link).find(TV_EPISODE_LINK_HOST).text().split('\'')[1];
    const url = $(link).find(TV_EPISODE_LINK_URL).attr('href');
    const rating = +$(link).find(TV_EPISODE_LINK_RATING).text().split(' ')[1].split('/')[0];
    const views = parseInt($(link).find(TV_EPISODE_LINK_VIEWS).text().split(' ')[1], 10);

    return { host, url, rating, views };
  });

  return parsedLinks;
};