'use strict';

let Player = require('./models.js').Player;
let Enemy = require('./models.js').Enemy;

function States () {
	this.x = 0;
	this.y = 0;
	this.velX = 2;
	this.velY = 10;
	this.playerVel = 5;
	this.gameRunning = false;
	this.killZone = 500;
	this.bullets = [];
	this.player = new Player(32, 32);
	this.enemies = [];
	// frame counter
	this.playerBulletNframeCounter = 0;
	// how many frames between every bullet generated
	// edited to time period 
	this.playerFinalBulletNframeCount = 50;
}

// reset game
States.prototype.reset = function () {
	this.enemies = [];
	this.bullets = [];
	this.player = new Player();
	this.createEnemyBodies();
	this.gameRunning = true;
}

States.prototype.createEnemyBodies = function () {
	for (var i = 0; i < 8; i += 1) { // controls width of enemies
		for (var j = 0; j < 8; j += 1) { // controls height of enemies
			// space out enemies
			this.enemies.push(new Enemy(45 * i, 20 + 45 * j));
		}
	}
}

module.exports = States;
