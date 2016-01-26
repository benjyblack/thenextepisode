export function Collection(){
	this.allSeries = [];

	this.indexOfSeries = function(seriesName) {
		for (var i = 0; i < allSeries.length; i++) {
      if (allSeries[i].name == name) {
        return i;
      }
    }
    return -1;
	}
}

export function Series(name){
	this.name = name;
	this.seasons = [];
	this.lastViewedEpisode = "";
}

export function Season(number){
	this.number = number;
	this.episodes = [];
}

export function Episode(name, number, seasonNumber, url){
	this.name = name;
	this.number = number;
	this.seasonNumber = seasonNumber;
	this.url = "";
	this.links = [];
}