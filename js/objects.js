function collection(){
	this.allSeries = [];

	this.indexOfSeries = function indexOfSeries(seriesName){
		for (var i = 0; i < allSeries.length; i++)
        	if (allSeries[i].name == name)
            	return i;
    	return -1;
	}
}

function series(name){
	this.name = name;
	this.seasons = [];
	this.lastViewedEpisode = "";
}

function season(number){
	this.number = number;
	this.episodes = [];
}

function episode(name, number, seasonNumber, url){
	this.name = name;
	this.number = number;
	this.seasonNumber = seasonNumber;
	this.url = "";
	this.links = [];
}