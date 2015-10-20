'use strict';
// var tracker = require('./tracking.js');
var models = require('./models.js');
var initialiseTrack = require('./tracking');


var Square = models.Square;
var Enemy = models.Enemy;
var Player = models.Player;
var Bullet = models.Bullet;

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
	var x = 0;
	var y = 0;
	var telePortBorder = 500;
	var velX = 2;
	var playerVel = 5;
	var gameRunning = false;
	var bullets = [];
	var player = new Player(32, 32);
	var enemies = [];
	var rightPressedKey = false;
	var leftPressedKey = false;
	// add listeners for when they let the key go
	document.addEventListener('keyup', e => {
		if (e.keyCode === 37) {
			leftPressedKey = false;
		} else if (e.keyCode === 39) {
			rightPressedKey = false;
		}
	});
	// when they push down
	document.addEventListener('keydown', e => {
		if (e.keyCode === 37) {
			leftPressedKey = true;
		} else if (e.keyCode === 39) {
			rightPressedKey = true;
		}
		// condition for shooting
		else if (e.keyCode === 32) {
			// this tells which direction the bullet to go
			bullets.push(new Bullet(player.x + player.w / 2, player.y, -1));
		}
	});
	// reset game
	function reset() {
		enemies = [];
		bullets = [];
		player = new Player();
		status.innerHTML = '';
		createEnemyBodies();
		gameRunning = true;
	}

	function createEnemyBodies() {
		// logic for creating enemies
		for (var i = 0; i < 8; i += 1) { // this loop controls width of block of enemies
			for (var j = 0; j < 8; j += 1) { // this loop controls height of block of enemies
				// space out enemies
				enemies.push(new Enemy(45 * i, 20 + 45 * j));
			}
		}
	}
	// animation loop because space invaders is a real-time game
	function update() {
		// clear rect on every frame
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (gameRunning) {
			player.update();
			drawRect(player);
			var leftMostEnemPix = enemies[0].x;
			var rightMostEnemPix = enemies[enemies.length - 1].x + enemies[0].w;

			if (leftMostEnemPix < 0 || rightMostEnemPix > canvas.width) {
				velX *= -1;
				enemies.forEach(function(item) {
					item.y += 35;
				});
			}
			// this causes bullets to move upwards
			bullets.forEach(function(item, indx, array) {
				item.update();
				drawRect(item);
			});

			enemies.forEach(function(item, indx, array) {
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

	function rectCollide(r1, r2) {
		var c1 = r1.x < r2.x + r2.w; // right edge of bullet is to the right of left edge of enemy
		var c2 = r2.x < r1.x + r1.w; // left edge of bullet is to the left of right edge of enemy
		var c3 = r1.y + r1.h > r2.y; // top edge of bullet is above bottom edge of enemy
		var c4 = r2.y + r2.h > r1.y // if the bottom edge of the bullet is below the top edge of the enemy
			// collision has happened
		return (c1 && c2 && c3 && c4);
	}

	function bulletEnemyCollision() {
		for (var i = 0; i < bullets.length; i += 1) {
			// if it is the player's bullets
			if (bullets[i].d === -1) {
				for (var j = 0; j < enemies.length; j += 1) {
					// this is for when bullets and enemies collide
						// collision has happened
					if (rectCollide(enemies[j], bullets[i]) === true) {
						// remove an invader and bullet
						enemies.splice(j, 1);
						bullets.splice(i, 1);
					}
					if (enemies.length === 0) {
						gameRunning = false;
						status.innerHTML = 'You win';
					}
				}
			}
			// this is the enemies bullets
			else {
				if (rectCollide(bullets[i], player)) {
					gameRunning = false;
					status.innerHTML = 'You lose';
				}
			}
		}
	}
	update();
	reset();
});

