import GameState from './states';
import {
	Square, Enemy, Player, EnemyBullet, PlayerBullet
}
from './models';
import inputs from './inputs';
import keys from './keystates';

(function() {

	let canvas = inputs.canvas;
	let status = inputs.status;
	keys.addListeners();

	window.addEventListener('load', () => {
		let ctx;
		if (canvas.getContext === undefined) {
			console.error('browser does not support canvas');
		} else {
			ctx = canvas.getContext('2d');
		}
		canvas.width = 800;
		canvas.height = 600;

		function update(gameState) {		
			if (gameState.gameRunning) {
				//gsw = game state with
				let gswKeys = interrogateKeyStates(gameState);
				let {
					x, y, gameRunning, bullets
					enemies, playerFinalBulletNframeCount,
					playerBulletNframeCounter, player
				} = gswKeys;
				let newPlayer = player.update();
				let newBullets = gameState.bullets.map((bullet) => bullet.update());
				let newEnemies = gameState.enemies.map((enemy) => enemy.update(gameState.velX));
				let gswNewPlayer = GameState({
					x, y, gameRunning, newBullets
					newEnemies, playerFinalBulletNframeCount,
					playerBulletNframeCounter, newPlayer
				});

				let gswBorderColl = enemyCollisionWithBorder(gswNewPlayer);
				let gswShootAI = enemyShootsAI(gswBorderColl);
				let gswFinal = bulletCollision(gswShootAI);
				draw(gwsFinal);
			} else {
				draw(gameState);
			}

		}

		function draw(gameState){
			ctx.clearRect(0, 0, canvas.width, canvas.height);	
			gameState.enemies.forEach(function(item, indx, array) {
				// draw each enemy
				drawRect(item);
			});
			gameState.bullets.forEach(function(item, indx, array) {
				drawRect(item);
			});

			drawRect(gameState.player);

			setTimeout(() => update(gameState), 1);
		};

		function interrogateKeyStates(gameState) {
			let leftPressedKey = keys.leftPressedKey;
			let rightPressedKey = keys.rightPressedKey;
			let spacePressedKey = keys.spacePressedKey;
			let rPressedKey = keys.rPressedKey;

			let {
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			} = gameState;

			// make the movement of the player more smooth
			let moveLeft = leftPressedKey === true && gameState.player.x > 0;
			let moveRight = rightPressedKey === true && gameState.player.x < canvas.width - 32
			let dir = 0;
			if(moveLeft){
				dir = -1;
			} else if(moveRight){
				dir = 1;
			}
			let newX = gameState.player.x + dir*gameState.playerVel;
			let newPlayer = Player(newX);

			let newGameState = GameState({
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, newPlayer
			});

			let shoot = spacePressedKey === true
			if (rPressedKey === true) {
				return GameState();
			} else if(shoot){
				return playerShoots(newGameState)
			} else{
				return newGameState;
			}
		}

		function playerShoots(gameState) {
			let {
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			} = gameState;

			if (gameState.playerBulletNframeCounter > 0) {
				gameState.playerBulletNframeCounter -= 1;
			}

			if (gameState.playerBulletNframeCounter === 0) {
				gameState.bullets.push(PlayerBullet({x: gameState.player.x + gameState.player.w / 2, y: gameState.player.y}));
				inputs.playerShootSound.play();
				gameState.playerBulletNframeCounter = gameState.playerFinalBulletNframeCount;
			}

			let newGameState = GameState({
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			});

			return newGameState;
		}

		function enemyShootsAI(gameState) {
			let {
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			} = gameState;

			if ((Math.random() * 100) <= 1) {
				enemyShoots(gameState);
			}

			let newGameState = GameState({
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			});

			return newGameState;
		}

		function enemyCollisionWithBorder(gameState) {
			let {
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			} = gameState;

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

			let newGameState = GameState({
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			});

			return newGameState;
		}

		function enemyShoots(gameState) {
			let {
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			} = gameState;

			let randIndx = Math.floor(Math.random() * (gameState.enemies.length - 1));
			let enemy = gameState.enemies[randIndx];
			let b = EnemyBullet({x: enemy.x, y: enemy.y});
			gameState.bullets.push(b); 
			inputs.invaderShootSound.play();

			let newGameState = GameState({
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			});

			return newGameState;
		}
		
		function drawRect(rect) {
			ctx.fillStyle = rect.color;
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

		function bulletCollision(gameState) {
			let {
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			} = gameState;

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
				// else it's the enemies' bullets
				else {
					if (sqCollide(gameState.bullets[i], gameState.player)) {
						inputs.playerDiesSound.play();
						gameState.gameRunning = false;
						status.innerHTML = 'You lose';
					}
				}
			}

			let newGameState = GameState({
				x, y, gameRunning, bullets
				enemies, playerFinalBulletNframeCount,
				playerBulletNframeCounter, player
			});

			return newGameState;
		}
		update(GameState());
	});

}());