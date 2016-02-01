/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AppState = __webpack_require__(1);

	var appState = new AppState();

	appState.init().then(function () {
	  console.log('AppState loaded');
	});

	window.AppState = appState;

	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	  if (request.action === 'sync') {
	    appState.sync();
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DB = __webpack_require__(2);

	var AppState = function () {
	  function AppState() {
	    _classCallCheck(this, AppState);

	    this._currentIndices = {
	      series: -1,
	      season: -1,
	      episode: -1
	    };

	    this._dbState = [];
	  }

	  _createClass(AppState, [{
	    key: 'init',
	    value: function init() {
	      var _this = this;

	      return DB.boot().then(function (db) {
	        _this._dbState = db;

	        if (_this._dbState.length) {
	          _this._currentIndices.series = 0;
	          _this._currentIndices.season = 0;
	          _this._currentIndices.episode = 0;
	        }
	      });
	    }
	  }, {
	    key: 'sync',
	    value: function sync() {
	      var _this2 = this;

	      return DB.get().then(function (db) {
	        _this2._dbState = db;
	      });
	    }
	  }, {
	    key: 'getNextSeries',
	    value: function getNextSeries() {
	      this._currentIndices.series = (this._currentIndices.series + 1) % this._dbState.length;
	      this._resetSeriesIndices();
	      return this.series;
	    }
	  }, {
	    key: 'getPreviousSeries',
	    value: function getPreviousSeries() {
	      if (--this._currentIndices.series < 0) {
	        this._currentIndices.series = this._dbState.length - 1;
	      }
	      this._resetSeriesIndices();
	      return this.series;
	    }
	  }, {
	    key: '_resetSeriesIndices',
	    value: function _resetSeriesIndices() {
	      this._currentIndices.season = 0;
	      this._currentIndices.episode = 0;
	    }
	  }, {
	    key: 'getNextSeason',
	    value: function getNextSeason() {
	      this._currentIndices.season = (this._currentIndices.season + 1) % this.series.seasons.length;
	      this._resetSeasonIndices();
	      return this.season;
	    }
	  }, {
	    key: 'getPreviousSeason',
	    value: function getPreviousSeason() {
	      if (--this._currentIndices.season < 0) {
	        this._currentIndices.season = this.series.seasons.length - 1;
	      }
	      this._resetSeasonIndices();
	      return this.season;
	    }
	  }, {
	    key: '_resetSeasonIndices',
	    value: function _resetSeasonIndices() {
	      this._currentIndices.episode = 0;
	    }
	  }, {
	    key: 'getNextEpisode',
	    value: function getNextEpisode() {
	      this._currentIndices.episode = (this._currentIndices.episode + 1) % this.season.episodes.length;
	      return this.episode;
	    }
	  }, {
	    key: 'getPreviousEpisode',
	    value: function getPreviousEpisode() {
	      if (--this._currentIndices.episode < 0) {
	        this._currentIndices.episode = this.season.episodes.length - 1;
	      }
	      return this.episode;
	    }
	  }, {
	    key: 'series',
	    get: function get() {
	      return this._dbState[this._currentIndices.series];
	    }
	  }, {
	    key: 'season',
	    get: function get() {
	      return this.series.seasons[this._currentIndices.season];
	    }
	  }, {
	    key: 'episode',
	    get: function get() {
	      return this.season.episodes[this._currentIndices.episode];
	    }
	  }]);

	  return AppState;
	}();

	module.exports = AppState;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var DB_NAME = 'TheNextEpisode';
	var DB_INITIAL_STATE = [];

	var boot = function boot() {
	  return get(DB_NAME).then(function (db) {
	    // initialize DB if does not exist yet
	    if (!db) {
	      return set(DB_INITIAL_STATE).then(function () {
	        return DB_INITIAL_STATE;
	      });
	    }

	    return db;
	  });
	};

	var get = function get() {
	  return new Promise(function (resolve) {
	    chrome.storage.local.get(DB_NAME, function (dbContainer) {
	      return resolve(dbContainer[DB_NAME]);
	    });
	  });
	};

	var set = function set(updatedDB) {
	  return new Promise(function (resolve) {
	    chrome.storage.local.set(_defineProperty({}, DB_NAME, updatedDB), function () {
	      return resolve.apply(undefined, arguments);
	    });
	  });
	};

	var addOrUpdate = function addOrUpdate(newSeries) {
	  return get().then(function (db) {
	    var indexOfSeries = _.findIndex(db, { name: newSeries.name });

	    if (indexOfSeries === -1) {
	      return set([].concat(_toConsumableArray(db), [newSeries]));
	    }

	    return set([].concat(_toConsumableArray(db.slice(0, indexOfSeries)), [newSeries], _toConsumableArray(db.slice(indexOfSeries + 1))));
	  });
	};

	module.exports = {
	  boot: boot,
	  get: get,
	  set: set,
	  addOrUpdate: addOrUpdate
	};

/***/ }
/******/ ]);