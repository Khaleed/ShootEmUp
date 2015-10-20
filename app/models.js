// I need to grab canvas and status elem
// from inputs module
var inputs = require('./inputs.js');
var canvas = inputs.canvas;
var status = inputs.status;
// make a Square class
function Square(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = 'white';
	this.update = function() {
		// placeholder
	};
}
// make a Player class that inherits from Square
function Player() {
	// inherit from Square
	Square.call(this, canvas.width / 2, canvas.height - 50, 32, 32);
	this.color = 'blue';
}
// Enemy inherits from Square
function Enemy(x, y) {
	// inherit from Square
	// uisng call to chain constructors
	Square.call(this, x, y, 25, 25);
	this.color = 'red';
	// initially go right (brain of enemy)
	this.update = function(state) {
		// make enemy move
		this.x += state.velX;
		// player loses if enemies reach the bottom   
		if (this.y > state.telePortBorder) {
			state.gameRunning = false;
			status.innerHTML = 'You lose';
		}
	};
}
// create Bullet class
function Bullet(x, y, d) {
	Square.call(this, x, y, 5, 15);
	this.color = 'white';
	this.d = d;
	this.update = function() {
		// fire bullet
		this.y += this.d;
	}
}
module.exports = {
	Square:Square,
	Player:Player,
	Enemy:Enemy,
	Bullet:Bullet
};