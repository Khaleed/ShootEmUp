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
// instantiate player obj
var player = new Player(32, 32);
// instantiate invader obj
var invader = new Enemy(32, 32);

// update the player's game logic on every key pressed
player.update = function() {

};
// update the enemy's game logic on every key pressed
invader.update = function() {
	this.x += 1;
};
// add listeners for when they let the key go
document.addEventListener('keyup', function(e) {
	if (e.keyCode === 37) {
		// move player
		// player.x -= 8;
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
	// clear screen to get ready for next frame
	ctx.clearRect(0, 0, 400, 600);
	drawRect(player);
	drawRect(invader);
	player.update();
	invader.update();
	//player.y+=1;
	setTimeout(update, 30);
}

update();

// make a Rectangle class
function Rectangle(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = 'white';
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
}

// draw any rectangle
function drawRect(rect) {
	// set color of rect
	ctx.fillStyle = rect.color;
	// draw rect
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}