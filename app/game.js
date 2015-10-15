// grab canvas/screen
var canvas = document.getElementById('screen');
// fallback if canvas is not supported
if (canvas.getContext === undefined) {
	console.error('browser does not support canvas');
} else {
	var ctx = canvas.getContext('2d');
}
// set properties of canvas
canvas.width = 400;
canvas.height = 600;
// set initial coordinates of canvas
var x = 0;
var y = 0;
var telBorder = 500;

// add listeners for when they let the key go
document.addEventListener('keyup', function(e) {
	if (e.keyCode === 37) {
		// move player
	} else if (e.keyCode === 39) {
		// player.x += 8;
	}
});
// when they push down
document.addEventListener('keydown', function(e) {
	if (e.keyCode === 37) {
		if (player.x > 0) {
			player.x -= 8;
		}
	} else if (e.keyCode === 39) {
		if (player.x < 400 - 32) {
			player.x += 8;
		}
	}
});

// updating game loop
function update() {
	ctx.clearRect(0, 0, 400, 600);
	
	player.update();
	drawRect(player);

	enemies.forEach(function(item, indx, array) {
		item.update();
		drawRect(item);
		// controller logic
		// if any touch the left-side of the screen
		// change direction 
		if( item.x < 0 || item.x > 400 - item.w) {
			enemies.forEach(function(item){
			item.velX *= -1;
			item.y += 35;	
			});
		}
	});
	setTimeout(update, 1);
}

// make a Rectangle class
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
	Rectangle.call(this, canvas.width/2, canvas.height-50, 32, 32);
	this.color = 'blue';
}
// Enemy inherits from Rectangle
function Enemy(x, y) {
	// inherit from Rectangle
	Rectangle.call(this, x, y, 35, 35);
	this.color = 'red';
	// initially go right
	this.velX = 1;
	this.update = function() {
	// make enemy move
	this.x += this.velX;
	if (this.y > telBorder) {
		this.y = 0;
	}
 };
}


var enemies = [];
for (var i = 0; i < 4; i += 1) {
	// space out enemies
	enemies.push(new Enemy(45*i, 20));
}
var player = new Player(32, 32);

// draw any rectangle
function drawRect(rect) {
	// set color of rect
	ctx.fillStyle = rect.color;
	// draw rect
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

update();







