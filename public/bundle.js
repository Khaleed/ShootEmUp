/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(2)['default'];
	
	var _states = __webpack_require__(3);
	
	var _states2 = _interopRequireDefault(_states);
	
	var _models = __webpack_require__(4);
	
	var _inputs = __webpack_require__(5);
	
	var _inputs2 = _interopRequireDefault(_inputs);
	
	var _keystates = __webpack_require__(6);
	
	var _keystates2 = _interopRequireDefault(_keystates);
	
	var gameState = new _states2['default']();
	var canvas = _inputs2['default'].canvas;
	var status = _inputs2['default'].status;
	_keystates2['default'].addListeners(gameState);
	
	window.addEventListener('load', function () {
		var ctx = undefined;
		if (canvas.getContext === undefined) {
			console.error('browser does not support canvas');
		} else {
			ctx = canvas.getContext('2d');
		}
		canvas.width = 800;
		canvas.height = 600;
	
		function update() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (gameState.gameRunning) {
				gameState.player.update();
				drawRect(gameState.player);
				interrogateKeyStates();
				enemyCollision();
				// loop through all bullets
				gameState.bullets.forEach(function (item, indx, array) {
					// update and draw each bullet
					item.update();
					drawRect(item);
				});
				// loop thorugh all enemies
				gameState.enemies.forEach(function (item, indx, array) {
					// update and draw each enemy
					item.update(gameState);
					drawRect(item);
				});
				enemyShootsAI();
				// detect collision
				bulletCollision();
			}
			setTimeout(update, 1);
		}
	
		function interrogateKeyStates() {
			var leftPressedKey = _keystates2['default'].leftPressedKey;
			var rightPressedKey = _keystates2['default'].rightPressedKey;
			var spacePressedKey = _keystates2['default'].spacePressedKey;
			var rPressedKey = _keystates2['default'].rPressedKey;
			// make the movement of the player more smooth
			if (leftPressedKey === true) {
				// and if the player is not beyond the left-most side of the screen
				if (gameState.player.x > 0) {
					// keep going left
					gameState.player.x -= gameState.playerVel;
				}
			}
			// same logic as above if the right key is pressed down
			if (rightPressedKey === true) {
				if (gameState.player.x < canvas.width - 32) {
					gameState.player.x += gameState.playerVel;
				}
			}
			// handle spacekey
			if (spacePressedKey === true) {
				playerShoots();
			}
			if (rPressedKey === true) {
				gameState.reset();
			}
		}
	
		function playerBulletnframeCounter() {
			if (gameState.playerBulletnFrameCounter > 0) {
				return gameState.playerBulletnFrameCounter -= 1;
			}
		}
	
		function playerShoots() {
			if (playerBulletnFrameCounter === 0) {
				gameState.bullets.push(new _models.Bullet(gameState.player.x + gameState.player.w / 2, gameState.player.y, -1));
				_inputs2['default'].playerShootSound.play();
				gameState.playerBulletnFrameCounter = gameState.playerFinalBulletnFrameCount;
			}
		}
	
		function enemyShootsAI() {
			if (Math.random() * 100 <= 1) {
				enemyShoots();
			}
		}
	
		function enemyCollision() {
			// set the left and right most enemy positions - collision with boundary
			var leftMostEnemPix = gameState.enemies[0].x;
			var rightMostEnemPix = gameState.enemies[gameState.enemies.length - 1].x + gameState.enemies[0].w;
			// ensure that enemies doesn't pass the borders of the screen
			if (leftMostEnemPix < 0 || rightMostEnemPix > canvas.width) {
				// if they do, move them in the opposite direction
				gameState.velX *= -1;
				// make enemies go down
				gameState.enemies.forEach(function (item) {
					// enemy keeps going down
					item.y += gameState.velY;
					if (item.y > gameState.killZone) {
						gameState.gameRunning = false;
						status.innerHTML = 'You lose';
					}
				});
			}
		}
	
		function enemyShoots() {
			var randIndx = Math.floor(Math.random() * (gameState.enemies.length - 1));
			var enemy = gameState.enemies[randIndx];
			var b = new _models.Bullet(enemy.x, enemy.y, +1);
			b.color = '#FF9900';
			gameState.bullets.push(b);
			_inputs2['default'].invaderShootSound.play();
		}
		// draw any Square
		function drawRect(rect) {
			// set color of rect
			ctx.fillStyle = rect.color;
			// draw rect
			ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		}
	
		function sqCollide(s1, s2) {
			var c1 = s1.x < s2.x + s2.w; // right edge of square 1 is to the right of left edge of square 2
			var c2 = s2.x < s1.x + s1.w; // left edge of square 1 is to the left of right edge of square 2
			var c3 = s1.y + s1.h > s2.y; // top edge of square 1 is above bottom edge of square 2
			var c4 = s2.y + s2.h > s1.y; //  bottom edge of the square 1 is below the top edge of the square 2
			// collision has happened
			return c1 && c2 && c3 && c4;
		}
	
		function bulletCollision() {
			for (var i = 0; i < gameState.bullets.length; i += 1) {
				// if it is the player's bullets
				if (gameState.bullets[i].d === -1) {
					for (var j = 0; j < gameState.enemies.length; j += 1) {
						if (sqCollide(gameState.enemies[j], gameState.bullets[i]) === true) {
							_inputs2['default'].invaderDiesSound.play();
							gameState.enemies.splice(j, 1);
							gameState.bullets.splice(i, 1);
							if (gameState.enemies.length === 0) {
								gameState.gameRunning = false;
								status.innerHTML = 'You win';
							}
							break;
						}
					}
				}
				// then it's the enemies' bullets
				else {
						if (sqCollide(gameState.bullets[i], gameState.player)) {
							_inputs2['default'].playerDiesSound.play();
							gameState.gameRunning = false;
							status.innerHTML = 'You lose';
						}
					}
			}
		}
		gameState.reset();
		update();
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Player = __webpack_require__(4).Player;
	var Enemy = __webpack_require__(4).Enemy;
	
	function States() {
		this.x = 0;
		this.y = 0;
		this.velX = 2;
		this.velY = 10;
		this.playerVel = 5;
		this.gameRunning = false;
		this.bullets = [];
		this.player = new Player(32, 32);
		this.enemies = [];
		// frame counter
		this.playerBulletNframeCounter = 0;
		// how many frames between every bullet generated
		// edited to time period
		this.playerFinalBulletNframeCount = 50;
	}
	
	// reset game
	States.prototype.reset = function () {
		this.enemies = [];
		this.bullets = [];
		this.player = new Player();
		this.createEnemyBodies();
		this.gameRunning = true;
	};
	
	States.prototype.createEnemyBodies = function () {
		// logic for creating enemies
		for (var i = 0; i < 8; i += 1) {
			// this loop controls width of block of enemies
			for (var j = 0; j < 8; j += 1) {
				// this loop controls height of block of enemies
				// space out enemies
				this.enemies.push(new Enemy(45 * i, 20 + 45 * j));
			}
		}
	};
	
	module.exports = States;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(2)['default'];
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.Square = Square;
	exports.Player = Player;
	exports.Enemy = Enemy;
	exports.Bullet = Bullet;
	
	var _inputs = __webpack_require__(5);
	
	var _inputs2 = _interopRequireDefault(_inputs);
	
	var canvas = _inputs2['default'].canvas;
	var status = _inputs2['default'].status;
	
	// make a Square class
	
	function Square(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = 'white';
		this.update = function () {
			// placeholder
		};
	}
	
	// make a Player class that inherits from Square
	
	function Player() {
		// inherit from Square
		Square.call(this, canvas.width / 2, canvas.height - 50, 25, 25);
		this.color = 'blue';
	}
	
	// Enemy inherits from Square
	
	function Enemy(x, y) {
		var _this = this;
	
		// inherit from Square
		// uisng call to chain constructors
		Square.call(this, x, y, 25, 25);
		this.color = 'red';
		// initially go right (brain of enemy)
		this.update = function (state) {
			// make enemy move
			_this.x += state.velX;
			// player loses if enemies reach the bottom
			if (_this.y > state.telePortBorder) {
				state.gameRunning = false;
				status.innerHTML = 'You lose';
			}
		};
	}
	
	// create Bullet class
	
	function Bullet(x, y, d) {
		var _this2 = this;
	
		Square.call(this, x, y, 5, 5);
		this.color = 'white';
		this.d = d;
		this.update = function () {
			// fire bullet
			_this2.y += _this2.d;
		};
	}
	
	function Shoe(size, color) {}

/***/ },
/* 5 */
/***/ function(module, exports) {

	// grab canvas and status
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports['default'] = {
		canvas: document.getElementById('screen'),
		status: document.getElementById('status'),
		playerShootSound: document.getElementById('player-shoots'),
		invaderShootSound: document.getElementById('invader-shoots'),
		invaderDiesSound: document.getElementById('invader-explodes'),
		playerDiesSound: document.getElementById('player-explodes')
	};
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _models = __webpack_require__(4);
	
	exports['default'] = {
		rightPressedKey: false,
		leftPressedKey: false,
		spacePressedKey: false,
		rPressedKey: false,
		addListeners: function addListeners(state) {
			var _this = this;
	
			// add listeners for when they let the key go
			document.addEventListener('keyup', function (e) {
				if (e.keyCode === 37) {
					_this.leftPressedKey = false;
				} else if (e.keyCode === 39) {
					_this.rightPressedKey = false;
				} else if (e.keyCode === 32) {
					_this.spacePressedKey = false;
				} else if (e.keyCode === 82) {
					_this.rPressedKey = false;
				}
			});
			document.addEventListener('keydown', function (e) {
				if (e.keyCode === 37) {
					_this.leftPressedKey = true;
				} else if (e.keyCode === 39) {
					_this.rightPressedKey = true;
				} else if (e.keyCode === 32) {
					_this.spacePressedKey = true;
				} else if (e.keyCode === 82) {
					console.log(e.keyCode === 82);
					_this.rPressedKey = true;
				}
			});
		}
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map