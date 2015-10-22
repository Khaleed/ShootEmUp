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
	
	// module that holds main game states
	
	var _states = __webpack_require__(3);
	
	var _states2 = _interopRequireDefault(_states);
	
	var _models = __webpack_require__(4);
	
	var _inputs = __webpack_require__(5);
	
	var _inputs2 = _interopRequireDefault(_inputs);
	
	var _tracking = __webpack_require__(6);
	
	var _tracking2 = _interopRequireDefault(_tracking);
	
	var _keystates = __webpack_require__(7);
	
	var _keystates2 = _interopRequireDefault(_keystates);
	
	console.log('hi');
	
	var gameState = new _states2['default']();
	// module that holds canvas and status elems
	var canvas = _inputs2['default'].canvas;
	var status = _inputs2['default'].status;
	// module that holds the tracking stuff
	// module to hold keystates
	// pass the new instance of States to addListeners function
	// from keystates
	_keystates2['default'].addListeners(gameState);
	// listen to when the DOM loads and then run animation loop
	window.addEventListener('load', function () {
		// fallback if canvas is not supported
		var ctx = undefined;
		if (canvas.getContext === undefined) {
			console.error('browser does not support canvas');
		} else {
			ctx = canvas.getContext('2d');
		}
		// set properties of canvas
		canvas.width = 800;
		canvas.height = 600;
		// set animation loop because space invaders is a real-time game
		function update() {
			// keep clearing the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// as long as the game is running
			if (gameState.gameRunning) {
				// left and right states
				var leftPressedKey = _keystates2['default'].leftPressedKey;
				var rightPressedKey = _keystates2['default'].rightPressedKey;
				var spacePressedKey = _keystates2['default'].spacePressedKey;
				var rPressedKey = _keystates2['default'].rPressedKey;
				// update player
				gameState.player.update();
				// draw gameState.player
				drawRect(gameState.player);
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
					// this tells which direction the bullet to go
					gameState.bullets.push(new _models.Bullet(state.player.x + state.player.w / 2, state.player.y, -1));
				}
				if (rightPressedKey === true) {
					gameState.reset();
				}
				if (Math.random() * 100 <= 1) {
					enemyShoots();
				}
				// make enemy shoot
				// detect collision
				bulletEnemyCollision();
			}
			setTimeout(update, 1);
		}
	
		function enemyShoots() {
			var randIndx = Math.floor(Math.random() * (gameState.enemies.length - 1));
			// select a random enemy
			var enemy = gameState.enemies[randIndx];
			// adding a bullet to the enemy
			gameState.bullets.push(new _models.Bullet(enemy.x, enemy.y, +0.1));
		}
		// draw any Square
		function drawRect(rect) {
			// set color of rect
			ctx.fillStyle = rect.color;
			// draw rect
			ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		}
		// if two squares collide
		function sqCollide(s1, s2) {
			var c1 = s1.x < s2.x + s2.w; // right edge of square 1 is to the right of left edge of square 2
			var c2 = s2.x < s1.x + s1.w; // left edge of square 1 is to the left of right edge of square 2
			var c3 = s1.y + s1.h > s2.y; // top edge of square 1 is above bottom edge of square 2
			var c4 = s2.y + s2.h > s1.y; //  bottom edge of the square 1 is below the top edge of the square 2
			// collision has happened
			return c1 && c2 && c3 && c4;
		}
	
		function bulletEnemyCollision() {
			// loop through all the bullets
			for (var i = 0; i < gameState.bullets.length; i += 1) {
				// if it is the player's bullets (the bullets that are going up)
				if (gameState.bullets[i].d === -1) {
					// loop through all the enemies
					for (var j = 0; j < gameState.enemies.length; j += 1) {
						// if player's bullets hit the enemies
						if (sqCollide(gameState.enemies[j], gameState.bullets[i]) === true) {
							// remove the invader and the bullet
							gameState.enemies.splice(j, 1);
							gameState.bullets.splice(i, 1);
							// as long as there no enemies left
							if (gameState.enemies.length === 0) {
								// pause the game
								gameState.gameRunning = false;
								// the player wins
								status.innerHTML = 'You win';
							}
							break;
						}
					}
				}
				// otherwise the bullets are from the enemy (those bullets that are going down)
				else {
						// if enemey bullets collide with the player
						if (sqCollide(gameState.bullets[i], gameState.player)) {
							// pause the game
							gameState.gameRunning = false;
							// show that player loses
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
		this.velY = 2;
		this.playerVel = 5;
		this.gameRunning = false;
		this.bullets = [];
		this.player = new Player(32, 32);
		this.enemies = [];
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

	// I need to grab canvas and status elem
	// from inputs module
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
		Square.call(this, canvas.width / 2, canvas.height - 50, 32, 32);
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
	
		Square.call(this, x, y, 5, 15);
		this.color = 'white';
		this.d = d;
		this.update = function () {
			// fire bullet
			_this2.y += _this2.d;
		};
	}

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
		status: document.getElementById('status')
	};
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	// take a look at it tomorrow
	'use strict';
	
	module.exports = function initialiseTrack(tracking) {
		// create custom color for green
		tracking.ColorTracker.registerColor('blue', function (r, g, b) {
			if (r < 50 && g < 50 && b > 200) {
				return true;
			}
			return false;
		});
		// create custom color for red
		tracking.ColorTracker.registerColor('red', function (r, g, b) {
			// returns true to any value that is close to 255
			// reduce g and b to less than 50
			if (r > 200 && g < 50 && b < 50) {
				return true;
			}
			return false;
		});
	
		// enable color detection for red and green using tracking.js library
		var colors = new tracking.ColorTracker(['blue', 'red']);
		colors.on('track', function (event) {
			if (event.data.length === 0) {
				// No colors were detected in this frame.
			} else {
					event.data.forEach(function (rect) {
						// loop through colors that where detected and draw  
						console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
					});
				}
		});
		// tracker instance listening for a track event, ready to start tracking
		tracking.track('#gameVid', colors);
		var myTracker = new tracking.Tracker('target');
		// listen for track events
		myTracker.on('track', function (event) {
			if (event.data.length === 0) {
				// No targets were detected in this frame.
			} else {
					event.data.forEach(function (data) {
						// Plots the detected targets here.
					});
				}
		});
		// utility to read <canvas>, <img>, <video>
		var trackerTask = tracking.track('#gameVid', myTracker);
		//
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// export function passing in the state (which is the new instance of States)
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
			// when they push down
			document.addEventListener('keydown', function (e) {
				if (e.keyCode === 37) {
					_this.leftPressedKey = true;
				} else if (e.keyCode === 39) {
					_this.rightPressedKey = true;
				}
				// condition for shooting
				else if (e.keyCode === 32) {
						_this.spacePressedKey = true;
					}
					// restart game
					else if (e.keyCode === 82) {
							_this.rPressedKey = true;
						}
			});
		}
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map