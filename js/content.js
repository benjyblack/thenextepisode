import $ from 'jquery';
import _ from 'lodash';

import { Series, Season, Episode } from './objects';
import { getFromStorage, setInStorage } from './local-storage-helper';

const SELECTOR_SERIES_NAME = '.movie_navigation .titles span a';
const SELECTOR_EPISODE = '.tv_episode_item';

const onReady = () => {
  getFromStorage('collection').then(({ collection }) => {
    debugger;
    var seriesName = $(SELECTOR_SERIES_NAME).text();
    var seriesAlreadyAdded = _.some(collection.allSeries, { name: seriesName });

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

  $('.tv_episode_item:not(".transp2")').each(function () {
    urls.push({
      url: $(this).find('a').attr('href'),
      episodeName: $(this).find('.tv_episode_name').text()
    });
  });

  urls.sort(function (a, b) {
    var aSeasonNumber = a.url.split('/')[2].split('-')[1]*1;
    var bSeasonNumber = b.url.split('/')[2].split('-')[1]*1;
    var aEpisodeNumber = a.url.split('/')[2].split('-')[3]*1;
    var bEpisodeNumber = b.url.split('/')[2].split('-')[3]*1;
    if (aSeasonNumber != bSeasonNumber) return aSeasonNumber - bSeasonNumber;
    else return aEpisodeNumber - bEpisodeNumber;
  });

  // seperate episodes into seasons
  var currentSeason = -1;
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];

    if(url.url.split('/')[2].split('-')[1] != currentSeason){
      currentSeason++;
      newSeries.seasons.push(new Season(currentSeason+1));
    }

    var episodeToAdd = new Episode(url.episodeName ? url.episodeName.split('-')[1].trim(0,1) :'',
      url.url.split('/')[2].split('-')[3], url.url.split('/')[2].split('-')[1], url);

    if (episodeToAdd.url == clickedEpisodeLink) clickedEpisode = episodeToAdd;

    newSeries.seasons[currentSeason].episodes.push(episodeToAdd);
  };

  collection.allSeries.push(newSeries);

  setInStorage({ 'collection' : collection }).then(() => {
    console.log(`${seriesName} added to local storage.`);

    document.location.href=clickedEpisodeLink;

    return true;
  });

};

document.addEventListener('DOMContentLoaded', onReady);