// assign
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

var x = 100;
var y = 100;

// instantiate player obj
var player = new Enemy(canvas.width / 2, canvas.height - 50, 32, 32);
player.color = "blue";
// instantiate invader obj
var invader = new Enemy();
// update the player's game logic on every key pressed
player.update = function() {

};
// add listeners for when they press the key
document.addEventListener('keyup', function(e) {
	console.log('key up event working');
	if (e.keyCode === 37) {
		// move player
		//player.x-=8;
	}
});

// when they push DOWN
document.addEventListener('keydown', function(e) {
	if (e.keyCode === 37) {
		// player.x-=8;
	}
});

// animate
function update() {
	// clear screen to get ready for next frame
	ctx.clearRect(0, 0, 400, 600);
	drawRect(player);
	//player.update();
	//player.y+=1;
	setTimeout(update, 30);
}

update();

// make Rectangle class
function Rectangle(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = 'white';
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