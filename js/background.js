var collection = [];
var seasons = [];
var episodes = [];
var currPageIndex = 0;

// check to see if local storage is set up
chrome.storage.local.get("collection", 
	function (result) { 
		if (jQuery.isEmptyObject(result)){
			chrome.storage.local.set({ 'collection' : new collection() }, function(){
				console.log("Series array created in local storage.");
			});
		}
		if (result.collection && result.collection.length > 0) {
			collection = result.collection;
			episodes = collection[0].episodes;
		};
	}
);

// given a URL, collect its html data
var getInformation = function(episode, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://www.1channel.ch" + episode.url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			callback(xhr.responseText);
		}
	};
	xhr.send(null);
}

// get the various host links for the episode
var pruneLinks = function (html) {
	var availableLinks = $(".movie_version", html);
	var prunedLinks = [];
	
	for (i = 0; i < availableLinks.length; i++)
	{
		var x = availableLinks[i];
		var website = $(x).find('.version_host').text().split("'")[1];
		
		// don't take any HD sponsor spam
		if (website == "HD Sponsor") continue;
		
		prunedLinks.push({
			website: website,
			link: $(x).find('.movie_version_link a').attr('href'),
			rating: $(x).find('.current-rating').text().split(' ')[1],
			num_views: $(x).find('.version_veiws').text().split(' ')[1]
		});
	}
	
	// sort the array by views as we give it back
	return prunedLinks.sort(function (a, b) {
		return (b.num_views - a.num_views);
	});
}

// gets the episode's links and title and returns it to the popup
var returnEpisodeDetails = function(episode, callback) {

	// get all links for the episode and then callback to display them
	getInformation(episode, 
		function(html) {
			episode.links = pruneLinks(html);
			
			callback(episode);
		}
	);
}

function onMessage(request, sender, callback) {
	switch (request.action) {
		case "openPopup":
			// if no links are available let the user know
			if (episodes.length == 0) callback(0);

			returnEpisodeDetails(episodes[episodes.indexOfEpisode(getCurrentSeries().nextEpisodeToView)], callback);
			break;
		case "getNextSeries":
			var nextSeries = collection.getCircularNext(getCurrentSeriesIndex());
			episodes = nextSeries.episodes;

			returnEpisodeDetails(episodes.getEpisodeByName(nextSeries.nextEpisodeToView), callback);
			break;
		case "getPrevSeries":
			var nextSeries = collection.getCircularPrev(getCurrentSeriesIndex());
			episodes = nextSeries.episodes;

			returnEpisodeDetails(episodes.getEpisodeByName(nextSeries.nextEpisodeToView), callback);
			break;
		case "getNextSeason":
			returnEpisodeDetails(episodes[episodes.indexOfFirstEpOfSeason(request.data*1 + 1)], callback);
			break;
		case "getPrevSeason":
			returnEpisodeDetails(episodes[episodes.indexOfFirstEpOfSeason(request.data*1 - 1)], callback);
			break;
		case "getNextEpisode":
			if (episodes.length == currPageIndex) return;
			
			returnEpisodeDetails(episodes[++currPageIndex], callback);
			break;
		case "getPrevEpisode":
			if (currPageIndex == 0) return;
			
			returnEpisodeDetails(episodes[--currPageIndex], callback);
			break;
		case "listingClicked":
			currPageIndex++;
			break;
		// seperate this into episodeClicked and addSeries listeners, with a condition to not call addSeries in 1channel.js if it already exists
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
	return collection.indexOfSeries(episodes[0].seriesName);
}

var getCurrentSeries = function() {
	return collection[getCurrentSeriesIndex()];
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