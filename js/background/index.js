const AppState = require('./app-state');

const appState = new AppState();

appState.init().then(() => {
  console.log('AppState loaded');
});

window.AppState = appState;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'sync') {
    appState.sync();
  }
});