
document.addEventListener('DOMContentLoaded', function () {
	
	var clickedEpisodeLink = null;
	var clickedEpisode = null;
	// if series has not been added yet to local storage, add it
		chrome.storage.local.get("collection", 
			function (result) { 
				var seriesName = $('.movie_navigation .titles span a').text();
				debugger;
				if (result.collection.indexOfSeries(seriesName) == -1){

					$('.tv_episode_item').click( function(event) {
	
						event.preventDefault();
						
						var urls = [];
					
						// create new series
						var newSeries = new series(seriesName);

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
							if(urls[i].url.split('/')[2].split('-')[1] != currentSeason){
								currentSeason++;
								newSeries.seasons.push(new season(currentSeason+1));
							}

							var episodeToAdd = new episode(url.episodeName ? url.episodeName.split('-')[1].trim(0,1) : "", 
								url.split('/')[2].split('-')[3], url.split('/')[2].split('-')[1], url);

							if (episodeToAdd.url == clickedEpisodeLink) clickedEpisode = episodeToAdd;

							newSeries.seasons[currentSeason].episodes.push(episodeToAdd);
						};
						debugger;
						result.collection.allSeries.push(newSeries);

						chrome.storage.local.set({ 'collection' : result.collection }, 
							function(){
								console.log(seriesName + " added to local storage.");
								
								document.location.href=clickedEpisodeLink;
							
								return true;
							}
						);
						
					});
				}
			}
		);
	
});
