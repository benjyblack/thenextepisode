const $ = require('jquery');
const _ = require('lodash');
const fetch = require('isomorphic-fetch');

const extractEpisodeLinks = require('../grammars/extract-episode-links');
const AppState = chrome.extension.getBackgroundPage().AppState;

const { BASE_URL } = require('../shared/constants');

const stateChanged = (AppState) => {
  $('.episode_listing').remove();
  $('#links')[0].innerHTML = 'Loading...';

  renderNav(AppState);
  return fetchLinks(AppState.episode.url).then(function (htmlResponse) {
    return extractEpisodeLinks(htmlResponse);
  }).then(function (links) {
    const sortedLinks = _.sortBy(links, 'views').reverse();
    renderLinks(sortedLinks);
  });
};

const fetchLinks = (episodeUrl) => {
  return fetch(BASE_URL + episodeUrl).then(function (response) {
    return response.text();
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

  $('#links')[0].innerHTML = episodeListItems.join('');
};

$(document).ready(function() {
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