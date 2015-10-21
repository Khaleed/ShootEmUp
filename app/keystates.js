// export function passing in the state (which is the new instance of States) 
import {Bullet} from './models';

export default {
	rightPressedKey: false,
	leftPressedKey: false,
	addListeners: function (state) {
	// add listeners for when they let the key go
	document.addEventListener('keyup', e => {
		if (e.keyCode === 37) {
			this.leftPressedKey = false;
		} else if (e.keyCode === 39) {
			this.rightPressedKey = false;
		}
	});
	// when they push down
	document.addEventListener('keydown', e => {
		if (e.keyCode === 37) {
			this.leftPressedKey = true;
		} else if (e.keyCode === 39) {
			this.rightPressedKey = true;
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
	}
};
