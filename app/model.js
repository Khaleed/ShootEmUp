'use strict';

import inputs from './input';

const canvas = inputs.canvas;

/**
 * Mixin that returns a constructor with new args when there is only one change
 * @function
 * @param { function } constr - The constructor function
 * @param { object } args - The arguments supplied to the constructor
 */
export function AssocMixin(constr, args) {
    return (key, val) => {
        const newArgs = Object.assign({}, args);
        newArgs[key] = val;
        // return a new constr with newArgs
        return constr(newArgs);
    };
}

/**
 * Mixin that returns a constructor with new args when there are mutiple changes
 * @function
 * @param { function } constr - The constructor function
 * @param { object } args - The arguments supplied to the constructor
 */
export function MergeMixin(constr, args) {
    return obj => {
        const copy = Object.assign({}, args);
        const newArgs = Object.assign(copy, obj);
        // spit out new constr with multiple args changes
        return constr(newArgs);
    };
}

/**
 * Function that takes a test and expression pairs. It evaluates each test one at a time. If the test returns true, cond returns the value from the corresponding expression and doesn't evaluate any of the other tests and expressions.
 * @param { function } test - conditional check
 * @param { function } result - any value
 * @param { object } args - The arguments supplied to the function
 */
export function cond(test, result, ...args) {
    if (test()) {
        return result();
    } else if (args.length > 1) {
        return cond(...args);
    } else if (args.length === 1) {
        return args[0]();
    } else {
        throw ('no matching values');
    }
}

/**
 *Function that takes list and val and returns a new immutable list
 *@param { array }  list - any list
 *@param { object } val - any valu
 * @constructor
 * @param { object } arg -The arguments of the player
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
        color: 'blue',
        assoc,
        merge,
        update: () => that
    });
    return that;
}

/**
 * Represents each enemy.
 * @constructor
 * @param { object } args - The arguments of the enemy
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
        color: 'white',
        assoc,
        merge,
        update: (velX, thisFrameDuration) => assoc('x', x + velX * thisFrameDuration)  // velX in pixels/s     frameDuration in s/frame.   velX * frameDuration = pixels/frame
    });
    return that;
}

/**
 * Represents each bullet
 * @constructor
 * @param { object} args - The arguments of each bullet
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
        update: thisFrameDuration => assoc('y', y + d * thisFrameDuration)
    });
    return that;
}

/**
 * Represents player's bullet
 * @constructor
 * @param { object} args - The arguments of player's bullet
 */
export function PlayerBullet(args) {
    const { x, y } = args;
    return Bullet({
        x,
        y,
        d: -0.2,
        color: 'yellow'
    });
}

/**
 * Represents player's bullet
 * @constructor
 * @param { object} args - The arguments of each enemy's bullet
 */
export function EnemyBullet(args) {
    const { x, y } = args;
    return Bullet({
        x,
        y,
        d: 0.2,
        color: 'red'
    });
}

const force = 0.001; // Gravity -> divide it by 20-ish

/**
 * Represents each particle that explodes
 * @constructor
 * @param { object } - args - The arguments of each particle
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
                                             vy: that.vy + force * thisFrameDuration })
    });
    return that;
}
