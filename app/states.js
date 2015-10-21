var Player = require('./models.js').Player;
var Enemy = require('./models.js').Enemy;

function States () {
	this.x = 0;
	this.y = 0;
	this.velX = 2;
	this.playerVel = 5;
	this.gameRunning = false;
	this.bullets = [];
	this.player = new Player(32, 32);
	this.enemies = [];
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
	// logic for creating enemies
	for (var i = 0; i < 8; i += 1) { // this loop controls width of block of enemies
		for (var j = 0; j < 8; j += 1) { // this loop controls height of block of enemies
			// space out enemies
			this.enemies.push(new Enemy(45 * i, 20 + 45 * j));
		}
	}
}

module.exports = States;