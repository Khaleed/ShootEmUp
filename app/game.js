'use strict';
console.log('hi');
// module that holds main game states
import States from './states';
import {Square, Enemy, Player, Bullet}  from './models';
import inputs  from './inputs';
import initialiseTrack from './tracking';
import keys  from './keystates';

let gameState = new States();
// module that holds canvas and status elems
let canvas = inputs.canvas;
let status = inputs.status;
// module that holds the tracking stuff
// module to hold keystates
// pass the new instance of States to addListeners function
// from keystates
keys.addListeners(gameState);
// listen to when the DOM loads and then run animation loop
window.addEventListener('load', () => {
	// fallback if canvas is not supported
	if (canvas.getContext === undefined) {
		console.error('browser does not support canvas');
	} else {
		var ctx = canvas.getContext('2d');
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
			// set the left and right most enemy positions
			var leftMostEnemPix = gameState.enemies[0].x;
			var rightMostEnemPix = gameState.enemies[gameState.enemies.length - 1].x + gameState.enemies[0].w;
			var leftPressedKey = keys.leftPressedKey;
			var rightPressedKey = keys.rightPressedKey;
			// update player
			gameState.player.update();
			// draw gameState.player
			drawRect(gameState.player);
			// ensure that enemies doesn't pass the borders of the screen
			if (leftMostEnemPix < 0 || rightMostEnemPix > canvas.width) {
				// if they do, move them in the opposite direction
				gameState.velX *= -1;
				// make enemies go down
				gameState.enemies.forEach(function(item) {
					// enemy keeps going down
					item.y += gameState.velY;
					if (item.y > gameState.killZone) {
						gameState.gameRunning === false;
						status.innerHTML = 'You lose';
					}
				});
			}
			// loop through all bullets
			gameState.bullets.forEach(function(item, indx, array) {
				// update and draw each bullet
				item.update();
				drawRect(item);
			});
			// loop thorugh all enemies
			gameState.enemies.forEach(function(item, indx, array) {
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
			if ((Math.random() * 100) <= 1) {
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
		gameState.bullets.push(new Bullet(enemy.x, enemy.y, +0.1));

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
		const c1 = s1.x < s2.x + s2.w; // right edge of square 1 is to the right of left edge of square 2
		const c2 = s2.x < s1.x + s1.w; // left edge of square 1 is to the left of right edge of square 2
		const c3 = s1.y + s1.h > s2.y; // top edge of square 1 is above bottom edge of square 2
		const c4 = s2.y + s2.h > s1.y //  bottom edge of the square 1 is below the top edge of the square 2
		// collision has happened
		return (c1 && c2 && c3 && c4);
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
							console.log(gameState.enemies.length === 0);
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
