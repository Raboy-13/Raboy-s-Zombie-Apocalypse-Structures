import { Dimension, Vector3 } from "@minecraft/server";

/**
 * Creates a new Vector3 object
 */
export function createVector3(x: number, y: number, z: number): Vector3 {
    return { x, y, z };
}

/**
 * Adds two vectors together
 */
export function addVectors(v1: Vector3, v2: Vector3): Vector3 {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z
    };
}

/**
 * Subtracts v2 from v1
 */
export function subtractVectors(v1: Vector3, v2: Vector3): Vector3 {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z
    };
}

/**
 * Multiplies a vector by a scalar value
 */
export function multiplyVector(vector: Vector3, scalar: number): Vector3 {
    return {
        x: vector.x * scalar,
        y: vector.y * scalar,
        z: vector.z * scalar
    };
}

/**
 * Normalizes a vector (makes its length 1)
 */
export function normalizeVector(vector: Vector3): Vector3 {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    return length > 0 ? multiplyVector(vector, 1 / length) : { x: 0, y: 0, z: 0 };
}

/**
 * Gets the dot product of two vectors
 */
export function dotProduct(v1: Vector3, v2: Vector3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Gets the cross product of two vectors
 */
export function crossProduct(v1: Vector3, v2: Vector3): Vector3 {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
}

/**
 * Generates a random location within a specified range around a given point, with optional air block validation.
 * 
 * @param location - The base Vector3 location to offset from
 * @param dimension - The Minecraft dimension to check blocks in
 * @param baseOffset - The minimum distance from the original location
 * @param additionalOffset - Extra distance added to the base offset
 * @param randomYOffset - Vertical offset applied to the Y coordinate
 * @param checkForAirBlock - If true, ensures the returned location contains an air block
 * 
 * @returns A new Vector3 location with random offsets applied, or undefined if no valid location was found after 30 attempts
 * when checkForAirBlock is true
 * 
 * @remarks
 * - The X and Z coordinates are now generated independently for better spatial distribution
 * - The total offset range for each axis is -totalOffset to +totalOffset where totalOffset = baseOffset + additionalOffset
 * - The function will attempt up to 30 times to find a location with an air block if checkForAirBlock is true
 * - The Y coordinate is only offset by the fixed randomYOffset value, not randomized
 */
export function getRandomLocation(location: Vector3, dimension: Dimension, baseOffset: number, additionalOffset: number, randomYOffset: number, checkForAirBlock: boolean): Vector3 | undefined {
    const randomOffset = () => {
        const totalOffset = baseOffset + additionalOffset;
        return (Math.random() * (totalOffset * 2)) - totalOffset;
    };

    const generateRandomLocation = (): Vector3 => {
        const randomVector = createVector3(randomOffset(), randomYOffset, randomOffset());
        return addVectors(location, randomVector);
    };

    const isAirBlock = (loc: Vector3) => {
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

/**
 * Calculates the Euclidean distance between two Vector3 points in 3D space.
 * 
 * @param point1 - The first Vector3 point
 * @param point2 - The second Vector3 point
 * 
 * @returns The distance between the two points as a number
 * 
 * @remarks
 * - Uses the Euclidean distance formula: sqrt((x2-x1)² + (y2-y1)² + (z2-z1)²)
 * - Returns a positive number representing the straight-line distance
 */
export function getDistance(point1: Vector3, point2: Vector3): number {
    const diff = subtractVectors(point2, point1);
    return Math.sqrt(dotProduct(diff, diff));
}

/**
 * Checks if two vectors are approximately equal within a tolerance
 */
export function vectorsAreEqual(v1: Vector3, v2: Vector3, tolerance = 0.0001): boolean {
    const diff = subtractVectors(v1, v2);
    return getDistance(diff, { x: 0, y: 0, z: 0 }) < tolerance;
}

/**
 * Lerps (linearly interpolates) between two vectors
 */
export function lerpVectors(v1: Vector3, v2: Vector3, t: number): Vector3 {
    t = Math.max(0, Math.min(1, t)); // Clamp t between 0 and 1
    const diff = subtractVectors(v2, v1);
    return addVectors(v1, multiplyVector(diff, t));
}