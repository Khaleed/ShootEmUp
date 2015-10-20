module.exports =  function (state) { 
	var rightPressedKey = false;
	var leftPressedKey = false;
	// add listeners for when they let the key go
	document.addEventListener('keyup', e => {
		if (e.keyCode === 37) {
			leftPressedKey = false;
		} else if (e.keyCode === 39) {
			rightPressedKey = false;
		}
	});
	// when they push down
	document.addEventListener('keydown', e => {
		if (e.keyCode === 37) {
			leftPressedKey = true;
		} else if (e.keyCode === 39) {
			rightPressedKey = true;
		}
		// condition for shooting
		else if (e.keyCode === 32) {
			// this tells which direction the bullet to go
			state.bullets.push(new Bullet(state.player.x + state.player.w / 2, state.player.y, -1));
		}
		else if (e.keyCode === 82) {
			state.reset();
		}
	});
};