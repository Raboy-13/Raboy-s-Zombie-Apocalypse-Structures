export function initIllagerTowerTurrets(location, dimension) {
    try {
        dimension.runCommand(`execute positioned ${location.x} ${location.y + 1} ${location.z} run function illager_settlement/tower/summon_arrow_turret`);
    }
    catch (error) {
        console.warn(`Failed to spawn arrow turret: ${error}`);
    }
    return;
}
export function spawnTowerGuards(location, dimension) {
    const guardCount = 3;
    for (let i = 0; i < guardCount; i++) {
        const offset = {
            x: (Math.random() * 2 - 1),
            z: (Math.random() * 2 - 1)
        };
        try {
            dimension.runCommand(`execute positioned ${location.x + offset.x} ${location.y + 1} ${location.z + offset.z} run function illager_settlement/tower/summon_tower_guard`);
        }
        catch (error) {
            console.warn(`Failed to spawn tower guard: ${error}`);
        }
    }
    return;
}
