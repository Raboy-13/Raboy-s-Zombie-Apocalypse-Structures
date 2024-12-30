/**
 * Generates a random integer between the specified minimum and maximum values (inclusive)
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random integer between min and max (inclusive)
 * @throws {Error} If min is greater than max
 * @example
 * // Returns a random number between 1 and 10
 * const randomNumber = getRandomInt(1, 10);
 */
export function getRandomInt(min: number, max: number): number {
    // Validate input parameters
    if (min > max) {
        throw new Error('Minimum value cannot be greater than maximum value');
    }

    // Convert parameters to integers in case they're floats
    min = Math.ceil(min);
    max = Math.floor(max);

    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random floating-point number between the specified minimum and maximum values (inclusive of min, exclusive of max).
 * @param min The minimum value (inclusive)
 * @param max The maximum value (exclusive)
 * @returns A random floating-point number between min and max
 * @throws {Error} If min is greater than or equal to max
 * @example
 * // Returns a random float between 0 and 1
 * const randomFloat = getRandomFloat(0, 1);
 */
export function getRandomFloat(min: number, max: number): number {
    // Validate input parameters
    if (min >= max) {
        throw new Error('Minimum value cannot be greater than or equal to maximum value');
    }
    return Math.random() * (max - min) + min;
}

/**
 * Picks a random element from the given array.
 * @param array The array to pick an element from
 * @returns A random element from the array
 * @throws {Error} If the array is empty
 * @example
 * // Returns a random element from the array
 * const randomElement = getRandomElement([1, 2, 3]);
 */
export function getRandomElement<T>(array: T[]): T {
    // Validate input parameters
    if (!array || array.length === 0) {
        throw new Error('Array cannot be empty');
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex < 0 || randomIndex >= array.length) {
        throw new Error('Random index is out of bounds');
    }
    return array[randomIndex]!;
}