'use strict';

import inputs from './input';

const canvas = inputs.canvas;

export function AssocMixin(constr, args) {
    return (key, val) => {
        const newArgs = Object.assign({}, args);
        newArgs[key] = val;
        return constr(newArgs);
    };
}

export function MergeMixin(constr, args) {
    return obj => {
        const copy = Object.assign({}, args);
        const newArgs = Object.assign(copy, obj);
        return constr(newArgs);
    };
}

// helper 1
export function cond(test, result, ...args) {
    if (test()) {
        return result();
    } else if (args.length > 1) {
        // recursively call cond for every arg
        return cond(...args);
    } else if (args.length === 1) {
        return args[0]();
    } else {
        throw ('no matching values');
    }
}

// helper 2
export function conjoin(list, val) {
    const newList = Object.assign([], list);
    newList.push(val);
    Object.freeze(newList);
    return newList;
}

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

export function PlayerBullet(args) {
    const { x, y } = args;
    return Bullet({
        x,
        y,
        d: -0.2,
        color: 'yellow'
    });
}

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
