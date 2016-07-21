const _ = require('lodash');
const cheerio = require('cheerio');

const Version = require('../models/version');

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

  return _.chain($(TV_VERSION_LINK))
    .reject((version) => {
      const linkTag = $(version).find(TV_VERSION_LINK_URL)[0];
      return $(linkTag).attr('onclick') &&
             $(linkTag).attr('onclick').match(TV_VERSION_LINK_SPAM);
    })
    .map((version) => {
      const host = $(version).find(TV_VERSION_LINK_HOST).text().split('\'')[1];
      const url = $(version).find(TV_VERSION_LINK_URL).attr('href');
      const rating = +$(version).find(TV_VERSION_LINK_RATING).text().split(' ')[1].split('/')[0];
      const views = parseInt($(version).find(TV_VERSION_LINK_VIEWS).text().split(' ')[1], 10);

      return new Version(host, url, rating, views);
    })
    .value();
};