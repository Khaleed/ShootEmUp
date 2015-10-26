import inputs from './inputs'
const canvas = inputs.canvas;
let status = inputs.status;

// // make a Square class
// // export function Square(args) {
// 	return args;
// // }
// // make a Player class that inherits from Square
export function Player() {
	// inherit from Square
	return {
		x: canvas.width / 2,
		y: canvas.height - 50,
		w: 25,
		h: 25,
		color: 'blue',
		update: () => {
			// placeholderå 
		}
	};
}
// Enemy inherits from Square
export function Enemy(args) {
	// de-structure
	let {
		x, y
	} = args;
	// create obj that we can talk about it
	let that = {
		x,
		y,
		w: 25,
			h: 25,
			color: 'red',
			update: state => {
				// make enemy move
				that.x += state.velX;
				// player loses if enemies reach the bottom
				if (that.y > state.telePortBorder) { // => fix this logic
					state.gameRunning = false;
					status.innerHTML = 'You lose';
				}
			}
	}
	return that;
}
// create Bullet class
export function Bullet(args) {
	let {
		x, y, d, color
	} = args
	let that = {
		x,
		y,
		w: 5,
		h: 5,
		d,
		color,
			update: () => {
				// fire bullet
				that.y += that.d;
			}
	}

	return that;
}

export function PlayerBullet(args){
	let{x, y} = args;
	return Bullet({x, y, d: -1, color: 'white'})
}

export function EnemyBullet(args){
	let{x, y} = args;
	return Bullet({x, y, d: 1, color: '#FF9900'})
}
