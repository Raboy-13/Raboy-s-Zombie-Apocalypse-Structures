import { Vector3, Dimension } from "@minecraft/server";
import { getRandomLocation } from "../utils/vector3";
import { getRandomInt, getRandomElement } from "../utils/rng";

/**
 * Summons random inhabitant illagers for an illager settlement
 * @param location The center location to spawn entities around
 * @param dimension The dimension to spawn entities in
 */
export function summonInhabitants(location: Vector3, dimension: Dimension): void {
    // Define entity types and their spawn ranges
    const entities = [
        { functionPath: "illager_settlement/inhabitants/summon_pillager", min: 3, max: 8 },
        { functionPath: "illager_settlement/inhabitants/summon_vindicator", min: 2, max: 7 },
        { functionPath: "illager_settlement/inhabitants/summon_evoker", min: 1, max: 2 }
    ];

    // Spawn settings
    const baseOffset = 0;
    const additionalOffset = 5;
    const yOffset = 1;

    try {
        // Spawn each type of entity
        for (const entity of entities) {
            const count = getRandomInt(entity.min, entity.max);

            for (let i = 0; i < count; i++) {
                const spawnPos = getRandomLocation(
                    location,
                    dimension,
                    baseOffset,
                    additionalOffset,
                    yOffset,
                    true
                );

                if (spawnPos) {
                    dimension.runCommand(`execute positioned ${spawnPos.x} ${spawnPos.y} ${spawnPos.z} run function ${entity.functionPath}`);
                }
            }
        }

        // Spawn the ravagers separately
        for (let i = 0; i < 2; i++) {
            const ravagerSpawnPos = getRandomLocation(
                location,
                dimension,
                baseOffset,
                additionalOffset,
                yOffset,
                true
            );

            if (ravagerSpawnPos) {
                if (ravagerSpawnPos) {
                    dimension.runCommand(`execute positioned ${ravagerSpawnPos.x} ${ravagerSpawnPos.y} ${ravagerSpawnPos.z} run function illager_settlement/inhabitants/summon_ravager`);
                }
            }
        }
    } catch (error) {
        console.warn(`Error spawning illager settlement inhabitants: ${error}`);
    }

    return;
}

/**
 * Summons a single villager at the specified location
 * @param location The exact location to spawn the villager
 * @param dimension The dimension to spawn the villager in
 */
export function summonVillager(location: Vector3, dimension: Dimension): void {
    try {
        dimension.runCommand(`execute positioned ${location.x} ${location.y} ${location.z} run function illager_settlement/inhabitants/summon_villager`);
    } catch (error) {
        console.warn(`Error spawning villager: ${error}`);
    }

    return;
}

/**
 * Summons 2-3 random farm animals at the specified location
 * @param location The center location to spawn animals around
 * @param dimension The dimension to spawn the animals in
 */
export function summonAnimals(location: Vector3, dimension: Dimension, minCount: number, maxCount: number): void {
    try {
        const animalTypes = [
            "illager_settlement/animals/summon_cow",
            "illager_settlement/animals/summon_pig",
            "illager_settlement/animals/summon_sheep",
            "illager_settlement/animals/summon_chicken",
            "illager_settlement/animals/summon_horse"
        ];

        const count = getRandomInt(minCount, maxCount);

        for (let i = 0; i < count; i++) {
            if (location) {
                const selectedAnimal = getRandomElement(animalTypes);
                dimension.runCommand(`execute positioned ${location.x} ${location.y} ${location.z} run function ${selectedAnimal}`);
            }
        }
    } catch (error) {
        console.warn(`Error spawning small animals: ${error}`);
    }

    return;
}

/**
 * Summons 2-4 sheep at the specified location with a 25% chance to summon a goat
 * @param location The exact location to spawn the sheep
 * @param dimension The dimension to spawn the sheep in
 */
export function summonSheep(location: Vector3, dimension: Dimension): void {
    try {
        const count = getRandomInt(2, 4);

        for (let i = 0; i < count; i++) {
            if (location) {
                // 25% chance to spawn a goat instead of a sheep
                const roll = Math.random();
                const animalType = roll < 0.25 ? "illager_settlement/animals/summon_goat" : "illager_settlement/animals/summon_sheep";
                dimension.runCommand(`execute positioned ${location.x} ${location.y} ${location.z} run function ${animalType}`);
            }
        }
    } catch (error) {
        console.warn(`Error spawning sheep/goat: ${error}`);
    }

    return;
}

/**
 * Summons butcher-related farm animals (cows, pigs, sheep, chickens) at the specified location
 * @param location The center location to spawn animals around
 * @param dimension The dimension to spawn the animals in
 * @param minCount Minimum number of animals to spawn
 * @param maxCount Maximum number of animals to spawn
 */
export function summonButcherAnimals(location: Vector3, dimension: Dimension, minCount: number, maxCount: number): void {
    try {
        const animalTypes = [
            "illager_settlement/animals/summon_cow",
            "illager_settlement/animals/summon_pig", 
            "illager_settlement/animals/summon_sheep",
            "illager_settlement/animals/summon_chicken"
        ];

        const count = getRandomInt(minCount, maxCount);

        for (let i = 0; i < count; i++) {
            if (location) {
                const selectedAnimal = getRandomElement(animalTypes);
                dimension.runCommand(`execute positioned ${location.x} ${location.y} ${location.z} run function ${selectedAnimal}`);
            }
        }
    } catch (error) {
        console.warn(`Error spawning butcher animals: ${error}`);
    }

    return;
}
