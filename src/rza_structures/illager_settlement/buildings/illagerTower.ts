import { Dimension, Vector3 } from "@minecraft/server";

export function initIllagerTowerTurrets(location: Vector3, dimension: Dimension): void {
    try {
        dimension.runCommand(
            `execute positioned ${location.x} ${location.y + 1} ${location.z} run function illager_settlement/tower/summon_arrow_turret`
        );
    } catch (error) {
        console.warn(`Failed to spawn arrow turret: ${error}`);
    }
    return;
}

export function spawnTowerGuards(location: Vector3, dimension: Dimension): void {
    // Number of guards to spawn
    const guardCount = 3;

    // Spawn multiple guards with slight position variations
    for (let i = 0; i < guardCount; i++) {
        // Add small random offset to prevent guards from spawning in the same spot
        const offset = {
            x: (Math.random() * 2 - 1), // Random value between -1 and 1
            z: (Math.random() * 2 - 1)
        };

        try {
            dimension.runCommand(
                `execute positioned ${location.x + offset.x} ${location.y + 1} ${location.z + offset.z} run function illager_settlement/tower/summon_tower_guard`
            );
        } catch (error) {
            console.warn(`Failed to spawn tower guard: ${error}`);
        }
    }
    return;
}