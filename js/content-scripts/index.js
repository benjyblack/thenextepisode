const $ = require('jquery');

const DB = require('./../db');
const extractSeries = require('./extract-series');

const { TV_EPISODE_SELECTOR } = require('../constants');

const onReady = () => {
  DB.boot().then(function () {
    $(TV_EPISODE_SELECTOR).click(handleClick);
  });
};

const handleClick = function (event) {
  event.preventDefault();

  const clickedEpisodeLink = $(this).find('a').attr('href');
  const parsedSeries = extractSeries($);

  return DB.addOrUpdate(parsedSeries).then(function () {
    console.log(`${parsedSeries.name} added to local storage.`);
    document.location.href = clickedEpisodeLink;
  });
};

document.addEventListener('DOMContentLoaded', onReady);