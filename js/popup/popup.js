const $ = require('jquery');
const _ = require('lodash');
const { BASE_URL, NO_EPISODES_MSG } = require('../shared/constants');

const AppState = chrome.extension.getBackgroundPage().AppState;

let linksEl,
  progressEl;

const renderNav = (AppState) => {
  $('#series-name-text').text(AppState.series.name);
  $('#season-name-text').text(`Season ${AppState.season.number}`);
  $('#episode-name-text').text(`Episode ${AppState.episode.number} - ${AppState.episode.name}`);
};

const renderLinks = (episodeLinks) => {
  progressEl.hide();

  const episodeListItems = _.map(episodeLinks, (link) => {
    return `<tr class="link" data-url="${link.url}">
      <td class='website'>${link.host.split('.')[0]}</td>
      <td class='views'>${link.views}</td>
      <td class='rating'>${link.rating}</td>
    </tr>`
  });

  if (!episodeListItems.length) {
    return linksEl.html(NO_EPISODES_MSG);
  }

  linksEl.html(episodeListItems.join(''));
};

const onClickNextEpisode = () => {
  var nextEpisode = AppState.getNextEpisode();
  AppState.getEpisodeLinks(nextEpisode.url).then(function (links) {
    openUrl(_.first(links).url);
  });
};

const onClickNavButton = ({ currentTarget: el }) => {
  var action = $(el).attr('data-action');
  AppState[action]();
  onStateChanged(AppState);
};

const onClickLink = ({ currentTarget: el }) => {
  openUrl($(el).attr('data-url'));
};

const onStateChanged = (AppState) => {
  linksEl.html('');
  progressEl.show();

  renderNav(AppState);
  return AppState
    .getEpisodeLinks(AppState.episode.url)
    .then(renderLinks);
};

const openUrl = (url) => {
  chrome.tabs.create({ url: BASE_URL + url });
};

$(document).ready(() => {
  linksEl = $('#links');
  progressEl = $('#progress-bar');

	onStateChanged(AppState);

  $('#next-episode').click(onClickNextEpisode);
	$('.nav-button').click(onClickNavButton);
  $('body').on('click', '.link', onClickLink);
});