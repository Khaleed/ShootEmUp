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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// var tracker = require('./tracking.js');
	var models = __webpack_require__(2);
	var Square = models.Square;
	var Enemy = models.Enemy;
	var Player = models.Player;
	var Bullet = models.Bullet;
	var initialiseTrack = __webpack_require__(3);
	var States = __webpack_require__(4);
	var gameState = new States();
	// run keystate.js immediately
	__webpack_require__(5)(gameState);

	window.addEventListener('load', function () {
		// grab canvas/screen
		var canvas = document.getElementById('screen');
		var status = document.getElementById('status');

		// fallback if canvas is not supported
		if (canvas.getContext === undefined) {
			console.error('browser does not support canvas');
		} else {
			var ctx = canvas.getContext('2d');
		}
		// set properties of canvas
		canvas.width = 800;
		canvas.height = 600;
		// set states
		// animation loop because space invaders is a real-time game
		function update() {
			// clear rect on every frame
			var player = gameState.player;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (gameState.gameRunning) {
				player.update();
				drawRect(player);
				var leftMostEnemPix = gameState.enemies[0].x;
				var rightMostEnemPix = gameState.enemies[enemies.length - 1].x + gameState.enemies[0].w;

				if (leftMostEnemPix < 0 || rightMostEnemPix > canvas.width) {
					gameState.velX *= -1;
					gameState.enemies.forEach(function (item) {
						item.y += 35;
					});
				}
				// this causes bullets to move upwards
				gameState.bullets.forEach(function (item, indx, array) {
					item.update();
					drawRect(item);
				});

				gameState.enemies.forEach(function (item, indx, array) {
					item.update();
					drawRect(item);
				});

				if (leftPressedKey === true) {
					if (player.x > 0) {
						player.x -= playerVel;
					}
				}

				if (rightPressedKey === true) {
					if (player.x < canvas.width - 32) {
						player.x += playerVel;
					}
				}
				// detect collision
				bulletEnemyCollision();
			}
			setTimeout(update, 1);
		}
		// draw any Square
		function drawRect(rect) {
			// set color of rect
			ctx.fillStyle = rect.color;
			// draw rect
			ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		}
		// if two squares collide
		function rectCollide(r1, r2) {
			var c1 = r1.x < r2.x + r2.w; // right edge of bullet is to the right of left edge of enemy
			var c2 = r2.x < r1.x + r1.w; // left edge of bullet is to the left of right edge of enemy
			var c3 = r1.y + r1.h > r2.y; // top edge of bullet is above bottom edge of enemy
			var c4 = r2.y + r2.h > r1.y; // if the bottom edge of the bullet is below the top edge of the enemy
			// collision has happened
			return c1 && c2 && c3 && c4;
		}

		function bulletEnemyCollision() {
			for (var i = 0; i < gameState.bullets.length; i += 1) {
				// if it is the player's bullets
				if (gameState.bullets[i].d === -1) {
					for (var j = 0; j < gameState.enemies.length; j += 1) {
						// this is for when bullets and enemies collide
						// collision has happened
						if (rectCollide(enemies[j], gameState.bullets[i]) === true) {
							// remove an invader and bullet
							gameState.enemies.splice(j, 1);
							gameState.bullets.splice(i, 1);
						}
						if (gameState.enemies.length === 0) {
							gameState.gameRunning = false;
							status.innerHTML = 'You win';
						}
					}
				}
				// if the bullets of the enemy hit the player
				// pause the game and show a message that the player loses
				else {
						if (rectCollide(bullets[i], player)) {
							gameState.gameRunning = false;
							status.innerHTML = 'You lose';
						}
					}
			}
		}
		update();
		reset();
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	

	// make a Square class
	'use strict';

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
		// inherit from Square
		Square.call(this, x, y, 25, 25);
		this.color = 'red';
		// initially go right (brain of enemy)
		this.update = function () {
			// make enemy move
			this.x += velX;
			// player loses if enemies reach the bottom  
			if (this.y > telePortBorder) {
				gameRunning = false;
				status.innerHTML = 'You lose';
			}
			// randomly create bullets
			if (Math.floor(Math.random() * 41) == 40) {
				// 0 to 40
				// adding a bullet to the list
				bullets.push(new Bullet(this.x, this.y, +0.1));
			}
		};
	}
	// create Bullet class
	function Bullet(x, y, d) {
		Square.call(this, x, y, 5, 15);
		this.color = 'white';
		this.d = d;
		this.update = function () {
			// fire bullet
			this.y += this.d;
		};
	}
	module.exports = {
		Square: Square,
		Player: Player,
		Enemy: Enemy,
		Bullet: Bullet
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Player = __webpack_require__(2).Player;

	function States() {
		this.x = 0, this.y = 0, this.velX = 2, this.playerVel = 5;
		this.gameRunning = false, this.bullets = [], this.player = new Player(32, 32);
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
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (state) {
		var rightPressedKey = false;
		var leftPressedKey = false;
		// add listeners for when they let the key go
		document.addEventListener('keyup', function (e) {
			if (e.keyCode === 37) {
				leftPressedKey = false;
			} else if (e.keyCode === 39) {
				rightPressedKey = false;
			}
		});
		// when they push down
		document.addEventListener('keydown', function (e) {
			if (e.keyCode === 37) {
				leftPressedKey = true;
			} else if (e.keyCode === 39) {
				rightPressedKey = true;
			}
			// condition for shooting
			else if (e.keyCode === 32) {
					// this tells which direction the bullet to go
					state.bullets.push(new Bullet(state.player.x + state.player.w / 2, state.player.y, -1));
				} else if (e.keyCode === 82) {
					state.reset();
				}
		});
	};

/***/ }
/******/ ]);