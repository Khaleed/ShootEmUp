// helper functions
export function createSizedArr(x) {
    return Array.apply(null, Array(x));
}

export function range(start, end) {
    if (end > start) {
        return Object.freeze(createSizedArr(end - start).map((_, i) => start + i));
    } else {
        return [start];
    }
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
 *@param { object } val - any value
 * @constructor
 * @param { object } arg -The arguments of the player
 */
export function conj(list, val) {
    const newList = Object.assign([], list);
    newList.push(val);
    Object.freeze(newList);
    return newList;
}

export function randomBetween(a, b) {
    return (a + (b - a) * Math.random());
}
