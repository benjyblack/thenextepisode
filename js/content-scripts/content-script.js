const { TV_EPISODE_SELECTOR } = require('../shared/constants');

document.querySelectorAll(TV_EPISODE_SELECTOR).forEach((link) => 
  link.addEventListener('click', () =>
    chrome.runtime.sendMessage({
      action: 'extract-and-persist-series',
      url: window.location.href
    })
  )
);