function loadingText() {
	
	// remove any previous listings
	$(".episode_listing").remove();
	
	$("#series-name-text").text("Loading...");
	$("#season-number-text").text("");
	$("#episode-name-text").text("");
}

function openPopup() {
	loadingText();

	chrome.extension.sendMessage({'action' : 'openPopup'}, 
		function(response) {
			if(response) display_links(response);
			else $("#series-name-text").text("No series selected");
			return true;
		}
	);
}

function display_links(episode) {
	
	$("#series-name-text").text(episode.seriesName);
	$("#season-number-text").text("Season " + episode.seasonNumber);
	$("#episode-name-text").text("Episode " + episode.episodeNumber + " - " + episode.episodeName);
	
	for (i = 0; i<episode.links.length; i++) {
		var currLink = episode.links[i];
		var item = "<li class='episode_listing'>"
			+ "<a target='_blank' href='http://www.1channel.ch" + currLink.link + "'>" 
			+ "<span class='website'>" + currLink.website.split('.')[0] + "</span>" 
			+ "<span class='views'>" + currLink.num_views + "</span>" 
			+ "<span class='rating'>" + currLink.rating + "</span>" 
			+ "</a></li>";
		
		$("#episode-list").append(item);
	}	
	

	$(".episode_listing a").click( 
		function () {		
			chrome.extension.sendMessage({'action' : 'listingClicked'});
		}
	);
}

var extractPageSeason = function() {
	return $("#season-number-text").text().split(' ')[1];
}

var extractPageEpisode = function() {
	return $("#episode-name-text").text().split(' ')[1]
}

$(document).ready(function() {
	openPopup();
	
	$("[class*='nav-buttons']").click(function () {
		var classes = $(this).attr('class');
		var action = "";
		var data = "";
		
		if (classes.indexOf('prev') != -1){
			if (classes.indexOf('series') != -1){
				action = "getPrevSeries";
			}
			else if (classes.indexOf('season') != -1){
				action = "getPrevSeason";
				data = extractPageSeason();
			}
			else {
				action = "getPrevEpisode";
				data = extractPageEpisode();
			}
		}
		else {
			if (classes.indexOf('series') != -1){
				action = "getNextSeries";
			}
			else if (classes.indexOf('season') != -1){
				action = "getNextSeason";
				data = extractPageSeason();
				console.log("getting season data");
			}
			else {
				action = "getNextEpisode";
				data = getPageEpisode();
			}
		}
		
		// show Loading message
		loadingText();
		
		chrome.extension.sendMessage({'action' : action, "data": data}, 
			function(response) {
				display_links(response);
			}
		);
	});
});