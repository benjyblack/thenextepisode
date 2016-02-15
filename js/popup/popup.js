const $ = require('jquery');
const _ = require('lodash');
const fetchHTML = require('../utility/fetch-html');

const extractEpisodeLinks = require('../grammars/extract-episode-links');
const AppState = chrome.extension.getBackgroundPage().AppState;

const { BASE_URL } = require('../shared/constants');

const stateChanged = (AppState) => {
  $('#links')[0].innerHTML = '';
  $('.progress').show();

  renderNav(AppState);
  return fetchHTML(`${BASE_URL}${AppState.episode.url}`).then((htmlResponse) => {
    return extractEpisodeLinks(htmlResponse);
  }).then((links) => {
    const sortedLinks = _.sortBy(links, 'views').reverse();
    $('.progress').hide();
    renderLinks(sortedLinks);
  });
};

const renderNav = (AppState) => {
  $('#series-name-text').text(AppState.series.name);
  $('#season-name-text').text(`Season ${AppState.season.number}`);
  $('#episode-name-text').text(`Episode ${AppState.episode.number} - ${AppState.episode.name}`);
};

const renderLinks = (episodeLinks) => {
  const episodeListItems = _.map(episodeLinks, (link) => {
    return `<tr class="link" data-url="${BASE_URL}${link.url}">
      <td class='website'>${link.host.split('.')[0]}</td>
      <td class='views'>${link.views}</td>
      <td class='rating'>${link.rating}</td>
    </tr>`
  });

  if (!episodeListItems.length) {
    return $('#links')[0].innerHTML = 'No episodes';
  }

  $('#links')[0].innerHTML = episodeListItems.join('');
};

$(document).ready(() => {
	stateChanged(AppState);

	$('.nav-button').click(function () {
    var action = $(this).attr('data-action');
    AppState[action]();
    stateChanged(AppState);
	});

  $('body').on('click', '.link', function () {
    var url = $(this).attr('data-url');
    chrome.tabs.create({ url: url });
  });
});