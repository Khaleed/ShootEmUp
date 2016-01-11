'use strict';

import { AssocMixin, MergeMixin, Player, Enemy, EnemyBullet, PlayerBullet, cond, conjoin } from './models.js';

function sqCollide(s1, s2) {
	const c1 = s1.x < s2.x + s2.w; // right edge of square 1 is to the right of left edge of square 2
	const c2 = s2.x < s1.x + s1.w; // left edge of square 1 is to the left of right edge of square 2
	const c3 = s1.y + s1.h > s2.y; // top edge of square 1 is above bottom edge of square 2
	const c4 = s2.y + s2.h > s1.y //  bottom edge of the square 1 is below the top edge of the square 2
	// collision has happened
	return (c1 && c2 && c3 && c4);
}

function range(start, end) {
	let result = [];
	for (let i = start; i < end; i += 1) {
		result.push(i);
	}
	return Object.freeze(result);
}

function createEnemyBodies() {
	let iter = range(0, 8);
	return iter.map(function(i) {
		return iter.map(function(j) {
			return Enemy({
				x: 45 * i,
				y: 20 + 45 * j
			});
		});
	}).reduce((result, next) => result.concat(next));
}

export default function GameState(args) {
	let { inputs, x = 0, y = 0, gameRunning = true, playerBullets = [], enemyBullets = [], enemies = createEnemyBodies(),
		player = Player({}), playerBulletNframeCounter = 0, playerFinalBulletNframeCount = 40, velX = 2 } = args;
	let assoc = AssocMixin(GameState, args); 
	let merge = MergeMixin(GameState, args);
	Object.freeze(enemies);
	Object.freeze(playerBullets);
	Object.freeze(enemyBullets);
	let velY = 10;
	let playerVel = 5;
	let killZone = 500;

	function newDir(keys) {
		return cond(
			() => keys.leftPressedKey === true && player.x > 0, () => -1,
			() => keys.rightPressedKey === true && player.x < inputs.canvas.width - 32, () => 1,
			() => 0);
	}

	function updatePlayerMovement(keys) {
		return assoc("player", cond(
			() => player, () => player.assoc("x", player.x + newDir(keys) * playerVel),
			() => false));
	}

	function updatePlayer(keys) {
		return cond(
			() => keys.spacePressedKey === true, () => updatePlayerMovement(keys).playerShoots(), 
			() => updatePlayerMovement(keys));
	}

	function maybeRestart(keys) {
		return keys.rPressedKey ? GameState({inputs}) : that
	}

	function updateGameLoop (keys) {
		return updatePlayer(keys).updateBodies().enemyCollisionWithBorder().enemyShootsAI().bulletCollision();
	}

	function updateIfGameIsRunning(keys) {
		let state = maybeRestart(keys)
		return gameRunning ? state.updateGameLoop(keys) : state
	}

	function updateBodies() {
		return merge({
			playerBullets: playerBullets.map(bullet => bullet.update()),
			enemyBullets: enemyBullets.map(bullet => bullet.update()),
			player: player.update(),
			enemies: enemies.map(enemy => enemy.update(velX))
		})
	}

	function makeNewBullet() {
		inputs.playerShootSound.play();
		return conjoin(playerBullets, PlayerBullet({ // conjoin => like using push functionally
			x: player.x + player.w / 2,
			y: player.y
		}));
	}

	function playerShoots() {
		let newBullets = cond(
		    () => playerBulletNframeCounter === 0, makeNewBullet,
		    () => playerBullets);
		let newCounter = cond(
			() => playerBulletNframeCounter > 0, () => playerBulletNframeCounter - 1, 
			() => playerFinalBulletNframeCount);

		let newGameState = merge({
			playerBulletNframeCounter: newCounter,
			playerBullets: newBullets
		});
		return newGameState;
	};

	function enemyShootsAI() {
		if ((Math.random() * 100) <= 1) {
			return enemyShoots();
		} else {
			return that; // current game state
		}
	}

	function playerDies() {
		inputs.playerDiesSound.play();
		inputs.status.innerHTML = 'You lose';
		return merge({
			gameRunning: false,
			enemyBullets: [],
			playerBullets: [],
			enemies: [],
			player: false
		});
	}

	function playerWins() {
		inputs.status.innerHTML = 'You win';
		return merge({
			gameRunning: false,
			enemyBullets: [],
			playerBullets: [],
			enemies: [],
			player: true
		});
	}
	
	function enemyCollisionWithBorder() {
		console.log("enemies", enemies[0])
		let leftMostEnemPix = enemies[0].x;
		let rightMostEnemPix = enemies[enemies.length - 1].x + enemies[0].w;
		let newVelX = velX;
		let newEnemies = enemies;
		// ensure that enemies don't pass the borders of the screen
		if (leftMostEnemPix < 0 || rightMostEnemPix > inputs.canvas.width) {
			let killZoneReached = false;
			newVelX = newVelX * -1;
			newEnemies = enemies.map(enemy => {
				let newY = enemy.y + velY;
				if (newY > killZone) {
					killZoneReached = true;
				}
				return enemy.assoc('y', newY);
			});
			if (killZoneReached === true) {
				return playerDies();
			}
		}
		let newGameState = merge({
			velX: newVelX,
			enemies: newEnemies
		});
		return newGameState;
	};

	function enemyShoots() {
		let randIndx = Math.floor(Math.random() * (enemies.length - 1));
		let enemy = enemies[randIndx];
		let newBullets = Object.assign([], enemyBullets);
		let b = EnemyBullet({
			x: enemy.x,
			y: enemy.y
		});
		newBullets.push(b);
		inputs.invaderShootSound.play();
		let newGameState = assoc('enemyBullets', newBullets);
		return newGameState;
	}

	function enemyHitBy(bullet) {
		return enemies.reduce((found, enemy) => {
			return found || (sqCollide(enemy, bullet) ? enemy : null)
		}, null);
	}

	function bulletCollision() {
		if (enemyBullets.some(bullet => sqCollide(bullet, player))) {
			return playerDies();
		}
		let newGameRunning = gameRunning;
		let newPlayer = player;
		let deadEnemies = [], usedBullets = []
		playerBullets.forEach(bullet => {
			let hit = enemyHitBy(bullet)
			if (hit) {
				deadEnemies.push(hit)
				usedBullets.push(bullet)
			}
		})
		let newPlayerBullets = playerBullets.filter(b => usedBullets.indexOf(b) == -1)
		let newEnemies = enemies.filter(e => deadEnemies.indexOf(e) == -1)
		return merge({
			gameRunning: newGameRunning,
			playerBullets: newPlayerBullets,
			enemies: newEnemies
		});
	}

	let that = Object.freeze({
		x,
		y,
		gameRunning,
		enemyBullets,
		playerBullets,
		enemies,
		playerFinalBulletNframeCount,
		playerBulletNframeCounter,
		player,
		updateIfGameIsRunning,
		bulletCollision,
		enemyCollisionWithBorder,
		enemyShootsAI,
		updateBodies,
		playerShoots,
		updateGameLoop,
		assoc,
		merge,
	});
	return that;
}