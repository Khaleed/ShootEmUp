'use strict';

let Player = require('./models.js').Player;
let Enemy = require('./models.js').Enemy;
let EnemyBullet = require('./models.js').EnemyBullet;
let PlayerBullet = require('./models.js').PlayerBullet;
let AssocMixin = require('./models.js').AssocMixin;
let MergeMixin = require('./models.js').MergeMixin;

function sqCollide(s1, s2) {
	const c1 = s1.x < s2.x + s2.w; // right edge of square 1 is to the right of left edge of square 2
	const c2 = s2.x < s1.x + s1.w; // left edge of square 1 is to the left of right edge of square 2
	const c3 = s1.y + s1.h > s2.y; // top edge of square 1 is above bottom edge of square 2
	const c4 = s2.y + s2.h > s1.y //  bottom edge of the square 1 is below the top edge of the square 2
		// collision has happened
	return (c1 && c2 && c3 && c4);
}

function range (start, end) {
	let result = [];
	for (let i = start; i < end; i +=1) {
		result.push(i);
	}
	return Object.freeze(result);
}

function createEnemyBodies() {
	let iter = range(0, 8);
	// [0, 1, 2, 3...7]
	return iter.map(function(i) {
		return iter.map(function(j) {
			return Enemy({
				x: 45 * i,
				y: 20 + 45 * j
			});
		});
	}).reduce((result, next) => result.concat(next));
}

function GameState(args) {
	
	let {
	keys,
	inputs,
	x = 0,
	y = 0,
	gameRunning = true,
	bullets = [],
	enemies = createEnemyBodies(),
	player = Player({}),
	playerBulletNframeCounter = 0,
	playerFinalBulletNframeCount = 40,
	velX = 2
	} = args;
	let assoc = AssocMixin(GameState, args);
	let merge = MergeMixin(GameState, args);
	Object.freeze(enemies);
	Object.freeze(bullets);
	let velY = 10;
	let playerVel = 5;
	let killZone = 500;

	function interrogateKeyStates() {
		let leftPressedKey = keys.leftPressedKey;
		let rightPressedKey = keys.rightPressedKey;
		let spacePressedKey = keys.spacePressedKey;
		let rPressedKey = keys.rPressedKey;

		let moveLeft = leftPressedKey === true && player.x > 0;
		let moveRight = rightPressedKey === true && player.x < inputs.canvas.width - 32;
		let dir = 0;

		if (moveLeft) {
			dir = -1;
		} else if (moveRight) {
			dir = 1;
		}

		let newPlayer = player;
		if(player){
			newPlayer = player.assoc("x", player.x + dir * playerVel);
		}
		// get new GameState 
		let newGameState = assoc("player", newPlayer);

		let shoot = spacePressedKey === true
		if (rPressedKey === true) {
			return GameState({keys, inputs});
		} else if (shoot) {
			return newGameState.playerShoots()
		} else {
			return newGameState;
		}
	}

	function update() {
		if (gameRunning) {
			return interrogateKeyStates().updateBodies().enemyCollisionWithBorder().enemyShootsAI().bulletCollision();
		} else {
			// return old obj since there is no change
			return interrogateKeyStates(); 
		}
	}

	function updateBodies() {
		return merge({
			bullets: bullets.map(bullet => bullet.update()),
			player: player.update(),
			enemies: enemies.map(enemy => enemy.update(velX))
		})
	}

	function playerShoots() {
		let newCounter = playerBulletNframeCounter;
		let newBullets = Object.assign([], bullets);
		
		if (playerBulletNframeCounter > 0) {
			newCounter = playerBulletNframeCounter - 1;
		}

		if (playerBulletNframeCounter === 0) {
			newBullets.push(PlayerBullet({
				x: player.x + player.w / 2,
				y: player.y
			}));
			inputs.playerShootSound.play();
			newCounter = playerFinalBulletNframeCount;
		}
		let newGameState = merge({playerBulletNframeCounter: newCounter, bullets: newBullets});
		console.log(newBullets.map(b => b.d))
		return newGameState;
	};

	function enemyShootsAI() {
		if ((Math.random() * 100) <= 1) {
			return enemyShoots();
		} else {
			return that; // current game state
		}
	}

	function die() {
		inputs.playerDiesSound.play();
		inputs.status.innerHTML = 'You lose';
		return merge({gameRunning: false, bullets: [], enemies: [], player: false});
	}

	function enemyCollisionWithBorder() {
		// set the left and right most enemy positions - collision with boundary
		let leftMostEnemPix = enemies[0].x;
		let rightMostEnemPix = enemies[enemies.length - 1].x + enemies[0].w;
		let newVelX = velX;
		let newEnemies = enemies;
		// ensure that enemies doesn't pass the borders of the screen
		if (leftMostEnemPix < 0 || rightMostEnemPix > inputs.canvas.width) {
			// if they do, move them in the opposite direction
			newVelX = newVelX * -1;
			// make enemies go down
			newEnemies = enemies.map(enemy => {
				// enemy keeps going down
				let newY = enemy.y + velY;
				if (newY > killZone) {
					return die();
				}
				return enemy.assoc('y', newY);
			});
		}
		let newGameState = merge({velX: newVelX, enemies: newEnemies});
		return newGameState;
	};

	function enemyShoots() {
		let randIndx = Math.floor(Math.random() * (enemies.length - 1));
		let enemy = enemies[randIndx];
		let newBullets = Object.assign([], bullets);
		let b = EnemyBullet({
			x: enemy.x,
			y: enemy.y
		});
		newBullets.push(b);
		inputs.invaderShootSound.play();
		let newGameState = assoc('bullets', newBullets);
		return newGameState;
	}

	function bulletCollision() {
	    let newGameRunning = gameRunning;
	    let newBullets = Object.assign([], bullets);
	    let newEnemies = Object.assign([], enemies);
	    let newPlayer = player;

		for (let i = 0; i < newBullets.length; i += 1) {
			// if it is the player's newBullets 
			if (newBullets[i].d === -1) {
				for (let j = 0; j < newEnemies.length; j += 1) {
					if (sqCollide(newEnemies[j], newBullets[i]) === true) {
						inputs.invaderDiesSound.play();
						newEnemies.splice(j, 1);
						newBullets.splice(i, 1);
						if (newEnemies.length === 0) {
							newGameRunning = false;
							inputs.status.innerHTML = 'You win';
						}
						break;
					}
				}
			}
			// else it is the enemies' bullets
			else if (sqCollide(newBullets[i], player)) {
					return die();
			}
		}
		let newGameState = merge({gameRunning: newGameRunning, bullets: newBullets, enemies: newEnemies});
		return newGameState;
	}

	let that = Object.freeze({
		x,
		y,
		gameRunning,
		bullets,
		enemies,
		playerFinalBulletNframeCount,
		playerBulletNframeCounter,
		player,
		update,
		bulletCollision,
		enemyCollisionWithBorder,
		enemyShootsAI,
		updateBodies,
		playerShoots,
		assoc,
		merge,
	});
	return that;
}

module.exports = GameState;