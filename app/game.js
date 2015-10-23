import States from './states';
import { Square, Enemy, Player, Bullet}
from './models';
import inputs from './inputs';
import initialiseTrack from './tracking';
import keys from './keystates';
let gameState = new States();
let canvas = inputs.canvas;
let status = inputs.status;
keys.addListeners(gameState);
window.addEventListener('load', () => {
	let ctx;
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
			let leftPressedKey = keys.leftPressedKey;
			let rightPressedKey = keys.rightPressedKey;
			let spacePressedKey = keys.spacePressedKey;
			let rPressedKey = keys.rPressedKey;
			// update player
			gameState.player.update();
			// draw gameState.player
			drawRect(gameState.player);
			// set the left and right most enemy positions - collision with boundary
			let leftMostEnemPix = gameState.enemies[0].x;
			let rightMostEnemPix = gameState.enemies[gameState.enemies.length - 1].x + gameState.enemies[0].w;
			// ensure that enemies doesn't pass the borders of the screen
			if (leftMostEnemPix < 0 || rightMostEnemPix > canvas.width) {
				// if they do, move them in the opposite direction
				gameState.velX *= -1;
				// make enemies go down
				gameState.enemies.forEach(function(item) {
					// enemy keeps going down
					item.y += gameState.velY;
					if (item.y > gameState.killZone) {
						gameState.gameRunning = false;
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
			if (gameState.playerBulletNFrameCounter > 0) {
				// decrement counter
				gameState.playerBulletNFrameCounter -= 1;
			}
			// handle spacekey
			if (spacePressedKey === true) {
				// this tells which direction the bullet to go
				if (gameState.playerBulletNFrameCounter === 0) {
					gameState.bullets.push(new Bullet(gameState.player.x + gameState.player.w / 2, gameState.player.y, -1));
					inputs.playerShootSound.play();
					// reset counter
					gameState.playerBulletNFrameCounter = gameState.playerFinalBulletNFrameCount;
				}
			}
			if (rPressedKey === true) {
				console.log(rightPressedKey);
				gameState.reset();
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

	function pressRtoReset () {
		
	}

	function enemyShoots() {
		let randIndx = Math.floor(Math.random() * (gameState.enemies.length - 1));
		let	enemy = gameState.enemies[randIndx];
		let	b = new Bullet(enemy.x, enemy.y, +1);
		b.color = '#FF9900';
		gameState.bullets.push(b);		
		inputs.invaderShootSound.play();
	}
	// draw any Square
	function drawRect(rect) {
		// set color of rect
		ctx.fillStyle = rect.color;
		// draw rect
		ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	}
	
	function sqCollide(s1, s2) {
		const c1 = s1.x < s2.x + s2.w; // right edge of square 1 is to the right of left edge of square 2
		const c2 = s2.x < s1.x + s1.w; // left edge of square 1 is to the left of right edge of square 2
		const c3 = s1.y + s1.h > s2.y; // top edge of square 1 is above bottom edge of square 2
		const c4 = s2.y + s2.h > s1.y //  bottom edge of the square 1 is below the top edge of the square 2
			// collision has happened
		return (c1 && c2 && c3 && c4);
	}

	function bulletEnemyCollision() {
		for (let i = 0; i < gameState.bullets.length; i += 1) {
			// if it is the player's bullets 
			if (gameState.bullets[i].d === -1) {
				for (let j = 0; j < gameState.enemies.length; j += 1) {
					if (sqCollide(gameState.enemies[j], gameState.bullets[i]) === true) {
						inputs.invaderDiesSound.play();
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
					inputs.playerDiesSound.play();
					gameState.gameRunning = false;
					status.innerHTML = 'You lose';
				}
			}
		}
	}
	gameState.reset();
	update();
});