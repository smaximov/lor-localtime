// ==UserScript==
// @name        Local time for LOR
// @namespace   https://maximov.space/userscripts
// @include     https://www.linux.org.ru/*
// @version     0.2.0
// @grant       none
// ==/UserScript==
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

	var _delay = __webpack_require__(1);

	var _util = __webpack_require__(2);

	var _date = __webpack_require__(3);

	var formatDate = function formatDate(date) {
	  var verbose = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	  var year = (0, _date.getYear)(date).toString();
	  var month = (0, _util.zeroPad)((0, _date.getMonth)(date), 2);
	  var day = (0, _util.zeroPad)((0, _date.getDay)(date), 2);

	  var now = new Date();

	  var dateString = undefined;

	  if (verbose && (0, _date.sameDay)(date, now)) {
	    dateString = 'сегодня';
	  } else if (verbose && (0, _date.sameDay)(date, (0, _date.yesterday)(now))) {
	    dateString = 'вчера';
	  } else {
	    dateString = day + '.' + month + '.' + year;
	  }

	  return dateString;
	};

	var pluralizeMinutes = function pluralizeMinutes(minutes) {
	  var lastDigit = minutes % 10;

	  if (minutes >= 10 && minutes <= 20 || lastDigit == 0 || lastDigit >= 5) return "минут";
	  if (lastDigit == 1) return "минута";
	  return "минуты";
	};

	var formatElapsedMinutes = function formatElapsedMinutes(elapsedMinutes) {
	  if (elapsedMinutes === 1) {
	    return 'минуту назад';
	  }
	  var minutesString = pluralizeMinutes(elapsedMinutes);
	  return elapsedMinutes + ' ' + minutesString + ' назад';
	};

	var formatDateTime = function formatDateTime(date) {
	  var verbose = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	  if (verbose) {
	    var elapsedMinutes = (0, _date.minutesElapsedSince)(date);

	    if (elapsedMinutes < 60) {
	      return formatElapsedMinutes(elapsedMinutes);
	    }
	  }

	  var hour = (0, _util.zeroPad)(date.getHours(), 2);
	  var minute = (0, _util.zeroPad)(date.getMinutes(), 2);
	  var seconds = (0, _util.zeroPad)(date.getSeconds(), 2);

	  var dateString = formatDate(date, verbose = verbose);

	  return dateString + ' ' + hour + ':' + minute + ':' + seconds;
	};

	var schedule = function schedule(action, stopCondition, delay) {
	  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
	    args[_key - 3] = arguments[_key];
	  }

	  var scheduler = {
	    then: function then(action) {
	      this.after = action;
	    }
	  };
	  scheduler.interval = setInterval(function () {
	    action.apply(undefined, args);
	    if (stopCondition.apply(undefined, args)) {
	      clearInterval(scheduler.interval);
	      if (scheduler.after) scheduler.after.apply(scheduler, args);
	    }
	  }, (0, _delay.translateDelay)(delay));
	  return scheduler;
	};

	var updateTime = function updateTime(elem, date) {
	  elem.textContent = formatDateTime(date, true);
	};

	var scheduleUpdateDays = function scheduleUpdateDays(elem, date) {
	  return schedule(updateTime, stopAfter({ days: 2 }), { hours: 1 }, elem, date);
	};

	var scheduleUpdateMinutes = function scheduleUpdateMinutes(elem, date) {
	  return schedule(updateTime, stopAfter({ hours: 1 }), { seconds: 10 }, elem, date);
	};

	var timeElapsed = function timeElapsed(date, delay) {
	  return new Date() - date >= (0, _delay.translateDelay)(delay);
	};

	var stopAfter = function stopAfter(delay) {
	  return function (_elem, date) {
	    return timeElapsed(date, delay);
	  };
	};

	var localizeTimeElement = function localizeTimeElement(elem) {
	  var time = elem.dateTime;
	  var date = new Date(time);
	  updateTime(elem, date);
	  elem.setAttribute('data-tooltip', formatDateTime(date, false));

	  if (!timeElapsed(date, { hours: 1 })) {
	    scheduleUpdateMinutes(elem, date).then(scheduleUpdateDays);
	  } else if (!timeElapsed(date, { days: 2 })) {
	    scheduleUpdateDays(elem, date);
	  }
	};

	var css = '\ntime[data-tooltip] {\n  border-bottom: 2px dotted grey;\n  cursor: pointer;\n}\ntime[data-tooltip]:hover {\n  position: relative;\n}\ntime[data-tooltip]:hover:after {\n  font-size: small;\n  content: attr(data-tooltip);\n  padding: 0.3em 0.5em;\n  color: #333;\n  position: absolute;\n  left: 2em;\n  top: 150%;\n  white-space: nowrap;\n  z-index: 20;\n  border-radius: 0.5em;\n  box-shadow: 0px 0px 4px #222;\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));\n  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);\n}\n';

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.body.appendChild(style);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
	  for (var _iterator = document.querySelectorAll('time')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	    var time = _step.value;

	    localizeTimeElement(time);
	  }
	} catch (err) {
	  _didIteratorError = true;
	  _iteratorError = err;
	} finally {
	  try {
	    if (!_iteratorNormalCompletion && _iterator.return) {
	      _iterator.return();
	    }
	  } finally {
	    if (_didIteratorError) {
	      throw _iteratorError;
	    }
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var FACTORS = exports.FACTORS = {
	    seconds: 1000,
	    minutes: 1000 * 60,
	    hours: 1000 * 60 * 60,
	    days: 1000 * 60 * 60 * 24
	};
	var units = Object.keys(FACTORS);

	var translateDelay = exports.translateDelay = function translateDelay(delay) {
	    var translated = 0;
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = units[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var unit = _step.value;

	            var value = delay[unit] || 0;
	            translated += value * FACTORS[unit];
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    return translated;
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var zeroPad = exports.zeroPad = function zeroPad(num, places) {
	  var numString = num.toString();
	  var zero = places - numString.length + 1;
	  return Array(+(zero > 0 && zero)).join('0') + num;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.minutesElapsedSince = exports.sameDay = exports.yesterday = exports.getDay = exports.getMonth = exports.getYear = undefined;

	var _delay = __webpack_require__(1);

	var getYear = exports.getYear = function getYear(date) {
	  return date.getFullYear();
	};
	var getMonth = exports.getMonth = function getMonth(date) {
	  return date.getMonth() + 1;
	};
	var getDay = exports.getDay = function getDay(date) {
	  return date.getDate();
	};

	var yesterday = exports.yesterday = function yesterday(date) {
	  var newDate = new Date(date);
	  newDate.setDate(date.getDate() - 1);
	  return newDate;
	};

	var sameDay = exports.sameDay = function sameDay(date1, date2) {
	  return getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2) && getDay(date1) === getDay(date2);
	};

	var minutesElapsedSince = exports.minutesElapsedSince = function minutesElapsedSince(date) {
	  var now = new Date();
	  var minutesDiff = (now - date) / _delay.FACTORS.minutes;
	  var roundingFunction = minutesDiff < 1 ? Math.ceil : Math.floor;
	  return roundingFunction(minutesDiff);
	};

/***/ }
/******/ ]);