// make a Square classnpm install -g node-inspector
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
	Square.call(this, x, y, 25, 25);
	this.color = 'red';
	// initially go right (brain of enemy)
	this.update = function() {
		// make enemy move
		this.x += velX;
		// set enemies back to top    
		if (this.y > telePortBorder) {
			gameRunning = false;
			status.innerHTML = 'You lose';
		}
		// randomly create bullets   ->  how do I make these bullets go slower and less bullets
		if (Math.floor(Math.random() * 30) == 6) { // 0 to 6
			// adding a bullet to the list
			bullets.push(new Bullet(this.x, this.y, +0.1));
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