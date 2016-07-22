const $ = require('jquery');
const _ = require('lodash');
const Cycle = require('@cycle/core');
const {button, table, tr, th, td, ul, li, i, span, div, makeDOMDriver} = require('@cycle/dom');
const {makeHTTPDriver} = require('@cycle/http');
const {Observable} = require('rx');

const { BASE_URL, NO_EPISODES_MSG } = require('../shared/constants');

var drivers = {
  DOM: makeDOMDriver('body'),
  Tab: link$ => {
    link$.subscribe(link => chrome.tabs.create({ url: BASE_URL + link }))
  }
};

function main({ DOM }) {
  const {
    navigate$,
    versionClicked$
  } = intent(DOM);
  const state$ = model(navigate$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    NavigationState: navigate$,
    Tab: versionClicked$
  };
}

function model(navigate$) {
  // return navigate$
  //   .map((method) {
  //     return 
  //   });
}

function intent(dom$) {
  return {
    navigate$: dom$
      .select('.nav-button')
      .events('click')
      .map(ev => ev.currentTarget.id)
      .startWith(false),
    versionClicked$: dom$
      .select('.quick-link')
      .events('click')
  };
}

function renderNavigation(state) {
  const BTN_CLASSES = '.btn.waves-effect.waves-light.nav-button';

  const iconLeft = i('.small.material-icons.left', 'skip_previous');
  const iconRight = i('.small.material-icons.right', 'skip_next');

  return ul([
    li('#goToNextEpisode.quick-link.btn.waves-effect.waves-light', 'Next Episode'),
    li('.episode-info-container', [
      span(`#prevSeries${BTN_CLASSES}`, [iconLeft]),
      span(`#series-name-text.episode-info`, state.series.name),
      span(`#nextSeries${BTN_CLASSES}`, [iconRight])
    ]),
    li(`.episode-info-container`, [
      span(`#prevSeason${BTN_CLASSES}`, [iconLeft]),
      span(`#season-name-text.episode-info`, `Season ${state.season.number}`),
      span(`#nextSeason${BTN_CLASSES}`, [iconRight])
    ]),
    li(`.episode-info-container`, [
      span(`#prevEpisode${BTN_CLASSES}`, [iconLeft]),
      span(`#episode-name-text.episode-info`, `Episode ${state.episode.number} - ${state.episode.name}`),
      span(`#nextEpisode${BTN_CLASSES}`, [iconRight])
    ])
  ])
}

function renderLinkTable(links) {
  return table('.link-container', [
    th([ span('Website'), span('Views'), span('Rating') ]),
    ...links.map(link => {
      return tr('.link', { 'data-url': BASE_URL + link.url }, [
        td('.website', {}, link.host.split('.')[0]),
        td('.views', {}, link.views),
        td('.rating', {}, link.rating)
      ])
    })
  ]);
}

function renderLoadingIndicator() {
  return div('#progress-bar.progress', [
    div('.indeterminate')
  ]);
}

function view(state$) {
  return state$.map((state) => {
    if (!state || !state.navigation || !state.links) {
      return renderLoadingIndicator();
    }

    return div([
      renderNavigation(state.navigation),
      renderLinkTable(state.links)
    ]);
  })
}

$(document).ready(() => {
  setTimeout(function () {
    Cycle.run(main, drivers);
  }, 2000);
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
//  var nextEpisode = NavigationState.goToNextEpisode();
//  NavigationState.getEpisodeLinks(nextEpisode.url).then(function (links) {
//    openUrl(_.first(links).url);
//  });
//};
//
//const onClickNavButton = ({ currentTarget: el }) => {
//  var action = $(el).attr('data-action');
//  NavigationState[action]();
//  onStateChanged(NavigationState);
//};
//
//const onClickLink = ({ currentTarget: el }) => {
//  openUrl($(el).attr('data-url'));
//};
//
//const onStateChanged = (NavigationState) => {
//  linksEl.html('');
//  progressEl.show();
//
//  renderNav(NavigationState);
//  return NavigationState
//    .getEpisodeLinks(NavigationState.episode.url)
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
//	onStateChanged(NavigationState);
//
//  $('#next-episode').click(onClickNextEpisode);
//	$('.nav-button').click(onClickNavButton);
//  $('body').on('click', '.link', onClickLink);
//});
