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
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	console.log("test");
	var canvas = document.getElementById('screen');
	var ctx = canvas.getContext('2d');

	canvas.width = 400;
	canvas.height = 600;

	var x = 100;
	var y = 100;
	// instantiate player obj
	var player = new Rectangle(100, 100, 300, 300);
	// add listeners to know when they press keys and let them go
	document.addEventListener('keyup', function (e) {
		console.log('key up event working');
		if (e.keyCode === 37) {
			player.x -= 19;
		}
	});
	document.addEventListener('keydown', function (e) {});

	// update the player's game logic on every key pressed
	player.update = function () {};
	// animate
	function update() {
		// clear screen to get ready for next frame
		ctx.clearRect(0, 0, 400, 600);
		drawRect(player);
		//player.y+=1;
		setTimeout(update, 30);
	}

	update();
	// make Rectangle class
	function Rectangle(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = 'white';
	}
	// draw any rectangle
	function drawRect(rect) {
		// set color of rect
		ctx.fillStyle = rect.color;
		// draw rect
		ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	}

/***/ }
/******/ ]);