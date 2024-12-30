import { getRandomLocation } from "../utils/vector3";
import { getRandomInt, getRandomElement } from "../utils/rng";
export function summonInhabitants(location, dimension) {
    const entities = [
        { functionPath: "illager_settlement/inhabitants/summon_pillager", min: 3, max: 8 },
        { functionPath: "illager_settlement/inhabitants/summon_vindicator", min: 2, max: 7 },
        { functionPath: "illager_settlement/inhabitants/summon_evoker", min: 1, max: 2 }
    ];
    const baseOffset = 0;
    const additionalOffset = 5;
    const yOffset = 1;
    try {
        for (const entity of entities) {
            const count = getRandomInt(entity.min, entity.max);
            for (let i = 0; i < count; i++) {
                const spawnPos = getRandomLocation(location, dimension, baseOffset, additionalOffset, yOffset, true);
                if (spawnPos) {
                    dimension.runCommand(`execute positioned ${spawnPos.x} ${spawnPos.y} ${spawnPos.z} run function ${entity.functionPath}`);
                }
            }
        }
        for (let i = 0; i < 2; i++) {
            const ravagerSpawnPos = getRandomLocation(location, dimension, baseOffset, additionalOffset, yOffset, true);
            if (ravagerSpawnPos) {
                if (ravagerSpawnPos) {
                    dimension.runCommand(`execute positioned ${ravagerSpawnPos.x} ${ravagerSpawnPos.y} ${ravagerSpawnPos.z} run function illager_settlement/inhabitants/summon_ravager`);
                }
            }
        }
    }
    catch (error) {
        console.warn(`Error spawning illager settlement inhabitants: ${error}`);
    }
    return;
}
export function summonVillager(location, dimension) {
    try {
        dimension.runCommand(`execute positioned ${location.x} ${location.y} ${location.z} run function illager_settlement/inhabitants/summon_villager`);
    }
    catch (error) {
        console.warn(`Error spawning villager: ${error}`);
    }
    return;
}
export function summonAnimals(location, dimension, minCount, maxCount) {
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
    }
    catch (error) {
        console.warn(`Error spawning small animals: ${error}`);
    }
    return;
}
export function summonSheep(location, dimension) {
    try {
        const count = getRandomInt(2, 4);
        for (let i = 0; i < count; i++) {
            if (location) {
                const roll = Math.random();
                const animalType = roll < 0.25 ? "illager_settlement/animals/summon_goat" : "illager_settlement/animals/summon_sheep";
                dimension.runCommand(`execute positioned ${location.x} ${location.y} ${location.z} run function ${animalType}`);
            }
        }
    }
    catch (error) {
        console.warn(`Error spawning sheep/goat: ${error}`);
    }
    return;
}
export function summonButcherAnimals(location, dimension, minCount, maxCount) {
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
    }
    catch (error) {
        console.warn(`Error spawning butcher animals: ${error}`);
    }
    return;
}
