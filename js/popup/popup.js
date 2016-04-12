const Cycle = require('@cycle/core');
const {button, ul, li, i, span, makeDOMDriver} = require('@cycle/dom');
const {makeHTTPDriver} = require('@cycle/http');
const {Observable} = require('rx');
const $ = require('jquery');

const AppState = chrome.extension.getBackgroundPage().AppState;

const makeAppStateDriver = () => {
  return function (action$) {
    return action$.map((action) => {
      if (action) AppState[action]();

      return AppState;
    });
  }
};

var drivers = {
  DOM: makeDOMDriver('body'),
  HTTP: makeHTTPDriver(),
  AppState: makeAppStateDriver()
};

// DOM Read: click next series
// AppState Write: Change episode
// DOM Write: Current state

function main({ DOM, AppState }) {
  const { action$ } = intent(DOM);
  const state$ = model(AppState);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    AppState: action$.startWith(false)
  };
}

function intent(DOMSource) {
  return {
    action$: DOMSource.select('.nav-button').events('click').map(ev => ev.currentTarget.id),
    clickLink$: DOMSource.select('.quick-link').events('click')
  };
}

function model(AppState) {
  return AppState;
}

function view(state$) {
  const BTN_CLASSES = '.btn.waves-effect.waves-light.nav-button';

  const iconLeft = i('.small.material-icons.left', 'skip_previous');
  const iconRight = i('.small.material-icons.right', 'skip_next');

  return state$.map(function (state) {
    return ul([
      li('#getNextEpisode.quick-link.btn.waves-effect.waves-light', 'Next Episode'),
      li('.episode-info-container', [
        span('#getPreviousSeries${BTN_CLASSES}', [iconLeft]),
        span('#series-name-text.episode-info', state.series.name),
        span('#getNextSeries${BTN_CLASSES}', [iconRight])
      ]),
      li('.episode-info-container', [
        span('#getPreviousSeason${BTN_CLASSES}', [iconLeft]),
        span('#season-name-text.episode-info', `Season ${state.season.number}`),
        span('#getNextSeason${BTN_CLASSES}', [iconRight])
      ]),
      li('.episode-info-container', [
        span('#getPreviousEpisode${BTN_CLASSES}', [iconLeft]),
        span('#episode-name-text.episode-info', `Episode ${state.episode.number} - ${state.episode.name}`),
        span('#getNextEpisode${BTN_CLASSES}', [iconRight])
      ])
    ]);
  });
}

$(document).ready(() => {
  Cycle.run(main, drivers);
});

//const _ = require('lodash');
//const { BASE_URL, NO_EPISODES_MSG } = require('../shared/constants');
//
//
//let linksEl,
//  progressEl;
//
//
//const renderLinks = (episodeLinks) => {
//  progressEl.hide();
//
//  const episodeListItems = _.map(episodeLinks, (link) => {
//    return `<tr class="link" data-url="${link.url}">
//      <td class='website'>${link.host.split('.')[0]}</td>
//      <td class='views'>${link.views}</td>
//      <td class='rating'>${link.rating}</td>
//    </tr>`
//  });
//
//  if (!episodeListItems.length) {
//    return linksEl.html(NO_EPISODES_MSG);
//  }
//
//  linksEl.html(episodeListItems.join(''));
//};
//
//const onClickNextEpisode = () => {
//  var nextEpisode = AppState.getNextEpisode();
//  AppState.getEpisodeLinks(nextEpisode.url).then(function (links) {
//    openUrl(_.first(links).url);
//  });
//};
//
//const onClickNavButton = ({ currentTarget: el }) => {
//  var action = $(el).attr('data-action');
//  AppState[action]();
//  onStateChanged(AppState);
//};
//
//const onClickLink = ({ currentTarget: el }) => {
//  openUrl($(el).attr('data-url'));
//};
//
//const onStateChanged = (AppState) => {
//  linksEl.html('');
//  progressEl.show();
//
//  renderNav(AppState);
//  return AppState
//    .getEpisodeLinks(AppState.episode.url)
//    .then(renderLinks);
//};
//
//const openUrl = (url) => {
//  chrome.tabs.create({ url: BASE_URL + url });
//};
//
//$(document).ready(() => {
//  linksEl = $('#links');
//  progressEl = $('#progress-bar');
//
//	onStateChanged(AppState);
//
//  $('#next-episode').click(onClickNextEpisode);
//	$('.nav-button').click(onClickNavButton);
//  $('body').on('click', '.link', onClickLink);
//});