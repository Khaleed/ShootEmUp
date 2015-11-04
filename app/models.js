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
// helper 1
export function cond(test, result, ...args) {
	if (test()) {
		return result();
	} else if (args.length > 1) {
		return cond(...args);
	} else if(args.length === 1) {
		return args[0]();
	} else {
		throw('no matching values');
	}
}
// helper 2
export function conjoin(list, val) {
	let newList = Object.assign([], list);
	newList.push(val);
	Object.freeze(newList);
	return newList;
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