'use strict';
// grab canvas/screen
var canvas = document.getElementById('screen');
// fallback if canvas is not supported
if (canvas.getContext === undefined) {
	console.error('browser does not support canvas');
} else {
	var ctx = canvas.getContext('2d');
}
// set properties of canvas
canvas.width = 800;
canvas.height = 600;
// set initial coordinates of canvas
var x = 0;
var y = 0;
var telePortBorder = 500;
var velX = 2;
var bulletVel = 10;
var playerVel = 10;
// add listeners for when they let the key go
document.addEventListener('keyup', function(e) {
	if (e.keyCode === 37) {
		if (player.x > 0) {
			player.x -= 2;
		}
	} else if (e.keyCode === 39) {
		if (player.x < canvas.width - 32) {
			player.x += 2;
		}
	}
});
// when they push down
document.addEventListener('keydown', function(e) {
	if (e.keyCode === 37) {
		if (player.x > 0) {
			player.x -= 8;
		}
	} else if (e.keyCode === 39) {
		if (player.x < canvas.width - 32) {
			player.x += 8;
		}
	}
	// condition for shooting
	else if (e.keyCode === 32) {
		playerBullets.push(new Bullet(player.x + player.w / 2, player.y));
	}
});
// animation loop because space invaders is a real-time game
function update() {
	// clear rect on every frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	player.update();
	drawRect(player);
	var leftMostEnemPix = enemies[0].x;
	var rightMostEnemPix = enemies[enemies.length - 1].x + enemies[0].w;

	if (leftMostEnemPix < 0 || rightMostEnemPix > canvas.width) {
		console.log('hi');
		velX *= -1;
		enemies.forEach(function(item) {
			item.y += 35;
		});
	}
	// this causes playerBullets to move upwards
	playerBullets.forEach(function(item, indx, array) {
		console.log(item);
		item.update();
		drawRect(item);
	});

	enemies.forEach(function(item, indx, array) {
		console.log(item);
		item.update();
		drawRect(item);
	});
	// detect collision
	bulletEnemyCollision();
	setTimeout(update, 1);
}
// make a Rectangle classnpm install -g node-inspector
function Rectangle(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = 'white';
	this.update = function() {

	};
}

// make a Player class that inherits from Rectangle
function Player(x, y) {
	// inherit from Rectangle
	Rectangle.call(this, canvas.width / 2, canvas.height - 50, 32, 32);
	this.color = 'blue';
}
// Enemy inherits from Rectangle
function Enemy(x, y) {
	// inherit from Rectangle
	Rectangle.call(this, x, y, 35, 35);
	this.color = 'red';
	// initially go right
	this.update = function() {
		// make enemy move
		this.x += velX;
		// set enemies back to top    
		if (this.y > telePortBorder) {
			this.y -= 500;
		}
	};
}
// create Bullet class
function Bullet(x, y) {
	Rectangle.call(this, x, y, 5, 15);
	this.color = 'white';
	this.update = function() {
		// fire bullet
		this.y -= bulletVel;
		// set enemies back to top
	}
}
// logic for creating enemies
var enemies = [];
for (var i = 0; i < 4; i += 1) { // this loop controls width of block of enemies
	for (var j = 0; j < 4; j += 1) { // this loop controls height of block of enemies
		// space out enemies
		enemies.push(new Enemy(45 * i, 20 + 45 * j));
	}
}
var playerBullets = [];
var player = new Player(32, 32);
// draw any rectangle
function drawRect(rect) {
	// set color of rect
	ctx.fillStyle = rect.color;
	// draw rect
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

function bulletEnemyCollision() {
	for (var i = 0; i < playerBullets.length; i += 1) {
		for (var j = 0; j < enemies.length; j += 1) {
			// this is for when playerBullets and enemies collide
			var c1 = enemies[j].x < playerBullets[i].x + playerBullets[i].w; // right edge of bullet is to the right of left edge of enemy
			var c2 = playerBullets[i].x < enemies[j].x + enemies[j].w; // left edge of bullet is to the left of right edge of enemy
			var c3 = enemies[j].y + enemies[j].h > playerBullets[i].y; // top edge of bullet is above bottom edge of enemy
			var c4 = playerBullets[i].y + playerBullets[i].h > enemies[j].y // if the bottom edge of the bullet is below the top edge of the enemy
				// collision has happened
			if (c1 && c2 && c3 && c4) {
				// remove an invader
				enemies.splice(j, 1);
				playerBullets.splice(i, 1);
				break;
			}
		}
	}
}

update();