const NavigationState = require('./navigation-state');

const navigationState = new NavigationState();

navigationState.init().then(() => {
  console.log('NavigationState loaded');
});

window.NavigationState = navigationState;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'sync') {
    navigationState.sync();
  }
});