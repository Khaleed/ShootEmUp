// helper functions
/**
 *Function that creates an empty list of any size
 *@param { number } x - The array length
 */
export function createSizedArr(n) {
    return Array.apply(null, Array(n));
}

/**
 *Function that returns a lazy sequence of numbers from start to end
 *@param { number } start - The starting index number, which defaults to 0
 *@param { number } end - The last index number
 */
export function range(start, end) {
    if (end > start) {
        return Object.freeze(createSizedArr(end - start).map((_, i) => start + i));
    } else {
        return [start];
    }
}

/**
 * Function that takes a test and expression pairs. It evaluates each test one at a time. If the test returns true, cond returns the value from the corresponding expression and doesn't evaluate any of the other tests and expressions.
 * @param { function } test - The conditional check
 * @param { function } result - The returned value
 * @param { object } args - The argument object that contains the functions supplied to the function
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
 *Function that takes a list and a value and returns a new immutable list
 *@param { array }  list - Any list
 *@param { object } val - Any value
 */
export function conj(list, val) {
    const newList = Object.assign([], list);
    newList.push(val);
    Object.freeze(newList);
    return newList;
}

/**
 *Function that takes two random numbers a and b and returns random numbers between a and b
 *@param { number } a - First number
 *@param { number } b - Second number
 */
export function randomBetween(a, b) {
    return (a + (b - a) * Math.random());
}
