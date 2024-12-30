export function getRandomInt(min, max) {
    if (min > max) {
        throw new Error('Minimum value cannot be greater than maximum value');
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomFloat(min, max) {
    if (min >= max) {
        throw new Error('Minimum value cannot be greater than or equal to maximum value');
    }
    return Math.random() * (max - min) + min;
}
export function getRandomElement(array) {
    if (!array || array.length === 0) {
        throw new Error('Array cannot be empty');
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex < 0 || randomIndex >= array.length) {
        throw new Error('Random index is out of bounds');
    }
    return array[randomIndex];
}
