'use strict';

let Player = require('./models.js').Player;
let Enemy = require('./models.js').Enemy;

function GameState (args) {
	let {
		x = 0,
		y = 0,
		gameRunning = false,
		bullets = [],
		enemies = createEnemyBodies(),
		player = Player({}),
		playerBulletNframeCounter = 0,
		playerFinalBulletNframeCount = 0
	} = args;

	return Object.freeze({
		velX: 2,
		velY: 10,
		playerVel: 5,
		killZone: 500,
		x, y, gameRunning, bullets
		enemies, playerFinalBulletNframeCount,
		playerBulletNframeCounter, player
	});
}

function createEnemyBodies (){
	let range = Array(8).keys();
	// [0, 1, 2, 3...7]
	return range.map(function(i){
		return range.map(function(j){
	  		return Enemy({x: 45 * i, y: 20 + 45 * j});
	  	});
 	}).reduce((result, next) => result.concat(next));
}

module.exports = States; // fix this in line with ES6/ES7
