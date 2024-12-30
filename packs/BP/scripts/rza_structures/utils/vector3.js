export function createVector3(x, y, z) {
    return { x, y, z };
}
export function addVectors(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z
    };
}
export function subtractVectors(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z
    };
}
export function multiplyVector(vector, scalar) {
    return {
        x: vector.x * scalar,
        y: vector.y * scalar,
        z: vector.z * scalar
    };
}
export function normalizeVector(vector) {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    return length > 0 ? multiplyVector(vector, 1 / length) : { x: 0, y: 0, z: 0 };
}
export function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
export function crossProduct(v1, v2) {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
}
export function getRandomLocation(location, dimension, baseOffset, additionalOffset, randomYOffset, checkForAirBlock) {
    const randomOffset = () => {
        const totalOffset = baseOffset + additionalOffset;
        return (Math.random() * (totalOffset * 2)) - totalOffset;
    };
    const generateRandomLocation = () => {
        const randomVector = createVector3(randomOffset(), randomYOffset, randomOffset());
        return addVectors(location, randomVector);
    };
    const isAirBlock = (loc) => {
        const block = dimension.getBlock(loc);
        return block?.isAir ?? false;
    };
    let randomLocation = generateRandomLocation();
    if (!checkForAirBlock) {
        return randomLocation;
    }
    let attempts = 0;
    while (!isAirBlock(randomLocation) && attempts < 30) {
        randomLocation = generateRandomLocation();
        attempts++;
    }
    return attempts < 30 ? randomLocation : undefined;
}
export function getDistance(point1, point2) {
    const diff = subtractVectors(point2, point1);
    return Math.sqrt(dotProduct(diff, diff));
}
export function vectorsAreEqual(v1, v2, tolerance = 0.0001) {
    const diff = subtractVectors(v1, v2);
    return getDistance(diff, { x: 0, y: 0, z: 0 }) < tolerance;
}
export function lerpVectors(v1, v2, t) {
    t = Math.max(0, Math.min(1, t));
    const diff = subtractVectors(v2, v1);
    return addVectors(v1, multiplyVector(diff, t));
}
