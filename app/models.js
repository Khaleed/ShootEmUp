import inputs from './inputs'
const canvas = inputs.canvas;
let status = inputs.status;

export function AssocMixin (constr, args) {
	return (prop, val) => {
		let newArgs = Object.assign({}, args);
		newArgs[prop] = val;
		return constr(newArgs);	
	}
}

export function MergeMixin (constr, args) {
	return obj => {
		let copy = Object.assign({}, args);
		let newArgs = Object.assign(copy, obj);
		return constr(newArgs);
	}
}

export function Player(args) {
	let { x = canvas.width / 2 } = args;
	let assoc = AssocMixin(Player, args);
	let merge = MergeMixin(Player, args);
	let that = Object.freeze({
		x,
		y: canvas.height - 50,
		w: 25,
		h: 25,
		color: 'blue',
		assoc,
		merge,
		update: () => {
			return that; 
		}
	});
	return that;
}

export function Enemy(args) {
	let { x, y } = args;
	let assoc = AssocMixin(Enemy, args);
	let merge = MergeMixin(Enemy, args);
	let that = Object.freeze({
		x,
		y,
		w: 25,
		h: 25,
		color: 'red',
		assoc,
		merge,
		update: velX => assoc("x", x + velX)
	});
	return that;
}

export function Bullet(args) {
	let { x, y, d, color } = args;
	let assoc = AssocMixin(Bullet, args); // interface-style inheritance
	let merge = MergeMixin(Bullet, args);
	let that = Object.freeze({
		x,
		y,
		w: 5,
		h: 5,
		d,
		color,
		assoc,
		merge,
		update: () => assoc("y", y + d)
	});
	return that;
}
// if base class has assoc/merge, then sub-classes have that too
// as long as you are returning a call to the base-class
export function PlayerBullet(args) {
	let { x, y } = args;
	return Bullet({
		x, y, d: -1, color: 'white'
	});
}

export function EnemyBullet(args) {
	let { x, y } = args;
	return Bullet({
		x, y, d: 1, color: '#FF9900'
	});
}