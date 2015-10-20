'use strict';
// var tracker = require('./tracking.js');
var models = require('./models.js');
var Square = models.Square;
var Enemy = models.Enemy;
var Player = models.Player;
var Bullet = models.Bullet;
var initialiseTrack = require('./tracking.js');
var States = require('./states.js');
var gameState = new States();
// run keystate.js immediately
require('./keystates.js')(gameState);

window.addEventListener('load', () => {
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
				gameState.enemies.forEach(function(item) {
					item.y += 35;
				});
			}
			// this causes bullets to move upwards
			gameState.bullets.forEach(function(item, indx, array) {
				item.update();
				drawRect(item);
			});

			gameState.enemies.forEach(function(item, indx, array) {
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
		var c4 = r2.y + r2.h > r1.y // if the bottom edge of the bullet is below the top edge of the enemy
			// collision has happened
		return (c1 && c2 && c3 && c4);
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

