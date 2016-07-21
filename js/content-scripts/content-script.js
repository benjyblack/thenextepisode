const $ = require('jquery');

const { TV_EPISODE_SELECTOR } = require('../shared/constants');

$(TV_EPISODE_SELECTOR).click(function (event) {
  chrome.runtime.sendMessage({
    action: 'extract-series',
    url: window.location.href
  });
});