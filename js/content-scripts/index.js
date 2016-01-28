import $ from 'jquery';
import _ from 'lodash';

import { Series, Season, Episode } from './../objects';
import { retrieve, store } from './../local-storage-helper';

const SELECTOR_SERIES_NAME = '.movie_navigation .titles span a';
const SELECTOR_EPISODE = '.tv_episode_item';

const onReady = () => {
  retrieve('TheNextEpisode').then((results) => {
    var seriesName = $(SELECTOR_SERIES_NAME).text();
    var seriesAlreadyAdded = _.some(results, { name: seriesName });

    if (seriesAlreadyAdded) return;

    $(SELECTOR_EPISODE).click(handleClick);
  });
};

const handleClick = function (event) {

  event.preventDefault();

  var urls = [];

  // create new series
  var newSeries = new Series(seriesName);

  clickedEpisodeLink = $(this).find('a').attr('href');


  collection.allSeries.push(newSeries);

  store({ 'collection' : collection }).then(() => {
    console.log(`${seriesName} added to local storage.`);

    document.location.href=clickedEpisodeLink;

    return true;
  });

};



document.addEventListener('DOMContentLoaded', onReady);