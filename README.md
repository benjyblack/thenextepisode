The Next Episode
================

NOTE: This extension is no longer supported

Chrome Web Store link: https://chrome.google.com/webstore/detail/thenextepisode/kjelkffopjkchfimcgjcolcdhjhoenme

TheNextEpisode is your guide for whatever TV series you're watching online.
TheNextEpisode is an interactive guide for whatever (public domain, of course) TV series you are watching on 1channel.ch. 

After you choose an episode on 1channel, the guide will gather information on every other episode available for that series. When you click TheNextEpisode button on your browser, you will be presented with a list, sorted by view count, of all the links available for the next episode. You can also navigate to any other episode from the guide.


###Architecture
####Database
The "database" being used is Chrome's local storage. Whenever a TV show's data is extracted from Primewire it is stored here. The data for a given TV show includes the names of all of its episodes as well as a link to their respective pages on Primewire.
####Background
The background process is responsible for two things: maintaining the current navigation state of the UI and for performing requests to retrieve version links.
####Content Script
This script is active in your browser when you're on the http://primewire.com domain. It waits for a click event on a TV Series link and then goes ahead and retrieves all the episode links for that series. It communicates directly with the database to store the extracted data.
####UI
The visual portion of the app is written in CycleJS and the Materialize CSS framework. Through it, the user can navigate between series, seasons and episodes of a given TV show. The interace itself communicates with the background process to get the navigation state and to ask for version links for a given episode.

###Glossary
####Version Link
For a given episode, Primewire provides links to stream it on multiple different hosts. Theses links are called Version Links.