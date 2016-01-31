const fetch = require('isomorphic-fetch');
const _ = require('lodash');

const DB = require('../shared/db');

const extractEpisodeLinks = require('../grammars/extract-episode-links');

var currentSeries,
  currentSeason;
var currPageIndex = 0;

const BASE_URL = 'http://primewire.ag';

DB.boot().then(function () {
  return DB.get();
}).then(function (result) {
  // set initial series and season
  currentSeries = _.first(result);
  currentSeason = _.first(currentSeries.seasons);
});

// gets the episode's links and title and returns it to the popup
var fetchEpisodeDetails = function(episode, callback) {
  const urlToFetch = `${BASE_URL}${episode.url}`;
  return fetch(urlToFetch).then(function (html) {
    episode.links = extractEpisodeLinks(html);

    callback(episode);
  });
};

function onMessage(request, sender, callback) {
	switch (request.action) {
		case "openPopup":
			// if no links are available let the user know
			if (currentSeason.episodes.length == 0) return callback(0);

			fetchEpisodeDetails(currentSeason[currentSeason.indexOfEpisode(getCurrentSeries().nextEpisodeToView)], callback);
			break;
		case "getNextSeries":
			var nextSeries = currentSeries.getCircularNext(getCurrentSeriesIndex());
			currentSeason = nextSeries.episodes;

			fetchEpisodeDetails(currentSeason.getEpisodeByName(nextSeries.nextEpisodeToView), callback);
			break;
		case "getPrevSeries":
			var nextSeries = currentSeries.getCircularPrev(getCurrentSeriesIndex());
			currentSeason = nextSeries.episodes;

			fetchEpisodeDetails(currentSeason.getEpisodeByName(nextSeries.nextEpisodeToView), callback);
			break;
		case "getNextSeason":
			fetchEpisodeDetails(currentSeason[currentSeason.indexOfFirstEpOfSeason(request.data*1 + 1)], callback);
			break;
		case "getPrevSeason":
			fetchEpisodeDetails(currentSeason[currentSeason.indexOfFirstEpOfSeason(request.data*1 - 1)], callback);
			break;
		case "getNextEpisode":
			if (currentSeason.length == currPageIndex) return;
			
			fetchEpisodeDetails(currentSeason[++currPageIndex], callback);
			break;
		case "getPrevEpisode":
			if (currPageIndex == 0) return;
			
			fetchEpisodeDetails(currentSeason[--currPageIndex], callback);
			break;
		case "listingClicked":
			currPageIndex++;
			break;
		// seperate this into episodeClicked and addSeries listeners, with a condition to not call addSeries in primewire.js if it already exists
		case "addSeries":		
			currentSeries = request.series;
			currPageIndex = request.clickedEpisodeIndex + 1;

			
		
			callback(1);
			break;
	}
	
	return true;
}  

// Wire up the listener. 
chrome.extension.onMessage.addListener(onMessage);

// helper functions
var getCurrentSeriesIndex = function() {
	return currentSeries.indexOfSeries(currentSeason[0].seriesName);
}

var getCurrentSeries = function() {
	return currentSeries[getCurrentSeriesIndex()];
}

Array.prototype.getEpisodeByDetails = function() {
	
}

Array.prototype.getEpisodeByName = function(episodeName) {
	for (var i = 0; i < this.length; i++){
        if (this[i].episodeName == episodeName)
            return this[i];
    }
    return -1;
}

Array.prototype.getCircularNext = function(curIndex) {
	if (this[curIndex + 1] == null){
		return this[0];
	}
	return this[curIndex + 1];
};

Array.prototype.getCircularPrev = function(curIndex) {
	if (this[curIndex - 1] == null){
		return this[this.length-1];
	}
	return this[curIndex - 1];
};

Array.prototype.indexOfEpisode = function(episodeName) {
    for (var i = 0; i < this.length; i++){
        if (this[i].episodeName == episodeName)
            return i;
    }
    return -1;
}

Array.prototype.indexOfFirstEpOfSeason = function(num) {
    for (var i = 0; i < this.length; i++)
        if (this[i].seasonNumber == num)
            return i;
    return -1;
}