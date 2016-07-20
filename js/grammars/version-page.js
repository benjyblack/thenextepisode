const _ = require('lodash');
const cheerio = require('cheerio');

const {
  TV_VERSION_LINK,
  TV_VERSION_LINK_HOST,
  TV_VERSION_LINK_URL,
  TV_VERSION_LINK_RATING,
  TV_VERSION_LINK_VIEWS,
  TV_VERSION_LINK_SPAM
} = require('../shared/constants');

module.exports = (html) => {
  const $ = cheerio.load(html);

  const realLinks = _.reject($(TV_VERSION_LINK), (link) => {
    const linkTag = $(link).find(TV_VERSION_LINK_URL)[0];
    return $(linkTag).attr('onclick') &&
           $(linkTag).attr('onclick').match(TV_VERSION_LINK_SPAM);
  });

  const parsedLinks = realLinks.map((link) => {
    const host = $(link).find(TV_VERSION_LINK_HOST).text().split('\'')[1];
    const url = $(link).find(TV_VERSION_LINK_URL).attr('href');
    const rating = +$(link).find(TV_VERSION_LINK_RATING).text().split(' ')[1].split('/')[0];
    const views = parseInt($(link).find(TV_VERSION_LINK_VIEWS).text().split(' ')[1], 10);

    return { host, url, rating, views };
  });

  return parsedLinks;
};