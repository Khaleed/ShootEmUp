// Game Constructor
function Game() {
	
	var screen = document.getElementById('screen').getContext('2d');
	var self = this;
	// spaceraiders is real-time and therefore we need something
	// to deal with the animation
	function tick() {
		// update the current game state
		self.update();
		// draw the current game state
		self.draw(screen);
	}
	tick();
};

Game.prototype =  {
	update: function() {

	},
	draw: function(screen) {
		console.log('hey there');
	}
}; 
// fired when scripts are loaded
// and canvas is ready to be drawn on
window.addEventListener('load', function() {
	new Game();
});