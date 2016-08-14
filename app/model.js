'use strict';

import inputs from './input';

const canvas = inputs.canvas;

export function AssocMixin(constr, args) {
    return (key, val) => {
        let newArgs = Object.assign({}, args);
        newArgs[key] = val;
        return constr(newArgs);
    };
}

export function MergeMixin(constr, args) {
    return obj => {
        let copy = Object.assign({}, args);
        let newArgs = Object.assign(copy, obj);
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
    let { x, y } = args;
    let assoc = AssocMixin(Enemy, args);
    let merge = MergeMixin(Enemy, args);
    let that = Object.freeze({
        x,
        y,
        w: 25,
        h: 25,
        color: 'white',
        assoc,
        merge,
        update: velX => assoc("x", x + velX)
    });
    return that;
}

export function Bullet(args) {
    let { x, y, d, color } = args;
    let assoc = AssocMixin(Bullet, args);
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

export function PlayerBullet(args) {
    let { x, y } = args;
    return Bullet({
        x,
        y,
        d: -1,
        color: 'yellow'
    });
}

export function EnemyBullet(args) {
    let { x, y } = args;
    return Bullet({
        x,
        y,
        d: 1,
        color: 'red'
    });
}

export function Particle(args) {
    let { x, y, vx, vy } = args;
    let assoc = AssocMixin(Particle, args);
    let merge = MergeMixin(Particle, args);
    let that = Object.freeze({
        x,
        y,
        vx,
        vy,
        w: 3,
        h: 3,
        assoc,
        merge,
        color: 'yellow',
        update: () => merge({x: that.x + that.vx,
                             y: that.y + that.vy,
                             vx: that.vx,
                             vy: that.vy}) // acceleration (gravity which is constant)
    });
    return that;
}
