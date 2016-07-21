const $ = require('jquery');

const StorageInterface = require('./../shared/storage-interface');
const extractSeries = require('./../grammars/series-page');

const { TV_EPISODE_SELECTOR } = require('../shared/constants');

const handleClick = function (event) {
  event.preventDefault();

  const clickedEpisodeLink = $(this).find('a').attr('href');
  const parsedSeries = extractSeries($('html').html());

  return StorageInterface.addOrUpdateSeries(parsedSeries)
    .then(() => {
      console.log(`${parsedSeries.name} added to local storage.`);

      chrome.runtime.sendMessage({ action: 'sync' });

      document.location.href = clickedEpisodeLink;
    })
    .catch((err) => {
      console.warn(`Could not add series ${parsedSeries.name}: ${err}`)
      document.location.href = clickedEpisodeLink;
    });
};


$(TV_EPISODE_SELECTOR).click(handleClick);