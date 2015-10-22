// export function passing in the state (which is the new instance of States) 
import {Bullet} from './models';

export default {
	rightPressedKey: false,
	leftPressedKey: false,
	spacePressedKey: false,
	rPressedKey: false,
	addListeners: function (state) {
	// add listeners for when they let the key go
	document.addEventListener('keyup', e => {
		if (e.keyCode === 37) {
			this.leftPressedKey = false;
		} else if (e.keyCode === 39) {
			this.rightPressedKey = false;
		} else if (e.keyCode === 32) {
			this.spacePressedKey = false;
		} else if (e.keyCode === 82) {
			this.rPressedKey = false;
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
			this.spacePressedKey = true;
		}
		// restart game
		else if (e.keyCode === 82) {
			this.rPressedKey = true;
		}
	});
	}
};
