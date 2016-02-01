const $ = require('jquery');

const DB = require('./../shared/db');
const extractSeries = require('./../grammars/extract-series');

const { TV_EPISODE_SELECTOR } = require('../shared/constants');

DB.boot().then(function () {
  $(TV_EPISODE_SELECTOR).click(handleClick);
});

const handleClick = function (event) {
  event.preventDefault();

  const clickedEpisodeLink = $(this).find('a').attr('href');
  const parsedSeries = extractSeries($('html').html());

  return DB.addOrUpdate(parsedSeries).then(function () {
    console.log(`${parsedSeries.name} added to local storage.`);

    chrome.runtime.sendMessage({ action: 'sync' });

    document.location.href = clickedEpisodeLink;
  });
};