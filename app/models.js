import inputs from './inputs'
const canvas = inputs.canvas;
let status = inputs.status;

// // make a Player class that inherits from Square
export function Player(args) {
	let { x = canvas.width / 2 } = args;
	// inherit from Square
	return {
		x,
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
			update: velX => {
				// make enemy move
				let x = that.x + velX;
				return Enemy({x, y: that.y});
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
				return Bullet({
					x: that.x,
					y: that.y + that.d,
					d: that.d,
					color: that.color
				})
			}
	}

	return that;
}

export function PlayerBullet(args) {
	let {
		x, y
	} = args;
	return Bullet({
		x, y, d: -1, color: 'white'
	})
}

export function EnemyBullet(args) {
	let {
		x, y
	} = args;
	return Bullet({
		x, y, d: 1, color: '#FF9900'
	})
}