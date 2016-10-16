'use strict';

import inputs from './input';

const canvas = inputs.canvas;

/**
 * Mixin that returns a constructor with new arguments object when only one value inside the arguments object changes
 * @function
 * @param { function } constr - The constructor function
 * @param { object } args - The optional object supplied to the constructor as an argument
 * @param { key } key - The key that is being mapped to a value inside args
 * @param { val } val = The value in args that the key maps to
 */
export function AssocMixin(constr, args) {
    return (key, val) => {
        const newArgs = Object.assign({}, args);
        newArgs[key] = val;
        return constr(newArgs);
    };
}

/**
 * Mixin that returns a constructor with new arguments object when there are mutiple changes
 * @function
 * @param { function } constr - The constructor function
 * @param { object } args - The optional object supplied to the constructor as an argument
 * @param { obj  } obj - The object that will over-write the old arguments object
 */
export function MergeMixin(constr, args) {
    return obj => {
        const copy = Object.assign({}, args);
        const newArgs = Object.assign(copy, obj);
        return constr(newArgs);
    };
}

/**
 * Represents a constructor that returns an immutable player object
 * @constructor
 * @param { object } args - The optional object that is passed as an argument
 */

export function Player(args) {
    const { x = canvas.width / 2 } = args;
    const assoc = AssocMixin(Player, args);
    const merge = MergeMixin(Player, args);
    const that = Object.freeze({
        x,
        y: canvas.height - 50,
        w: 55,
        h: 34,
        color: "blue",
        assoc,
        merge
    });
    return that;
}

/**
 * Represents a constructor that returns an immutable enemy object
 * @constructor
 * @param { object } args - The optional object that is passed as an argument
 */
export function Enemy(args) {
    const { x, y } = args;
    const assoc = AssocMixin(Enemy, args);
    const merge = MergeMixin(Enemy, args);
    const that = Object.freeze({
        x,
        y,
        w: 25,
        h: 25,
        color: "white",
        assoc,
        merge,
        update: (velX, thisFrameDuration) => assoc("x", x + velX * thisFrameDuration)
    });
    return that;
}

/**
 * Represents a constructor that returns an immutable bullet object
 * @constructor
 * @param { object } args - The optional object that is passed as an argument
 */
export function Bullet(args) {
    const { x, y, d, color } = args;
    const assoc = AssocMixin(Bullet, args);
    const merge = MergeMixin(Bullet, args);
    const that = Object.freeze({
        x,
        y,
        w: 5,
        h: 5,
        d,
        color,
        assoc,
        merge,
        update: thisFrameDuration => assoc("y", y + d * thisFrameDuration)
    });
    return that;
}

/**
 * Represents a function that returns an immutable player bullet
 * @constructor
 * @param { object } args - The optional object that is passed as an argument
 */
export function PlayerBullet(args) {
    const { x, y } = args;
    return Bullet({
        x,
        y,
        d: -0.2,
        color: "yellow"
    });
}

/**
 * Represents a function that returns an immutabe enemy bullet object
 * @constructor
 * @param { object } args - The optional object that is passed as an argument
 */
export function EnemyBullet(args) {
    const { x, y } = args;
    return Bullet({
        x,
        y,
        d: 0.2,
        color: "red"
    });
}

/**
 * Represents a function that returns an immutable particle object
 * @constructor
 * @param { object } args - The optional object that is passed as an argument
 */
export function Particle(args) {
    const { x, y, vx, vy, color } = args;
    const assoc = AssocMixin(Particle, args);
    const merge = MergeMixin(Particle, args);
    const that = Object.freeze({
        x,
        y,
        vx,
        vy,
        w: 3,
        h: 3,
        assoc,
        merge,
        color,
        update: thisFrameDuration => merge({ x: that.x + that.vx * thisFrameDuration,
                                             y: that.y + that.vy * thisFrameDuration,
                                             vx: that.vx,
                                             vy: that.vy + 0.001 * thisFrameDuration }) // force = 0.001
    });
    return that;
}
