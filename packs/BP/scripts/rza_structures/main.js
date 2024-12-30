import { system, world } from "@minecraft/server";
import { summonInhabitants, summonVillager, summonAnimals, summonSheep, summonButcherAnimals } from "./illager_settlement/inhabitants";
import { initIllagerTowerTurrets, spawnTowerGuards } from "./illager_settlement/buildings/illagerTower";
const DUST_STORM_PARTICLE = "rza:dust_storm";
const DUST_STORM2_PARTICLE = "rza:dust_storm2";
const FIRST_EFFECT_CHANCE = 0.001;
const SECOND_EFFECT_CHANCE = 0.003;
system.afterEvents.scriptEventReceive.subscribe(data => {
    const eventId = data.id;
    const sourceBlock = data.sourceBlock;
    if (!sourceBlock) {
        return;
    }
    const dimension = sourceBlock.dimension;
    const location = sourceBlock.center();
    switch (eventId) {
        case "rza:summon_illager_settlement_inhabitants":
            if (sourceBlock) {
                sourceBlock.setType("minecraft:air");
                summonInhabitants(location, dimension);
            }
            break;
        case "rza:summon_villager":
            if (sourceBlock) {
                sourceBlock.setType("minecraft:air");
                summonVillager(location, dimension);
            }
            break;
        case "rza:summon_animals_small":
            if (sourceBlock) {
                sourceBlock.setType("minecraft:air");
                summonButcherAnimals(location, dimension, 2, 3);
            }
            break;
        case "rza:summon_animals_pen":
            if (sourceBlock) {
                sourceBlock.setType("minecraft:air");
                summonAnimals(location, dimension, 2, 5);
            }
            break;
        case "rza:summon_shepherd_animals":
            if (sourceBlock) {
                sourceBlock.setType("minecraft:air");
                summonSheep(location, dimension);
            }
            break;
        case "rza:init_illager_tower_turrets":
            if (sourceBlock) {
                sourceBlock.setType("rza:turret_base");
                initIllagerTowerTurrets(location, dimension);
            }
            break;
        case "rza:summon_illager_tower_guards":
            if (sourceBlock) {
                sourceBlock.setType("minecraft:air");
                spawnTowerGuards(location, dimension);
            }
            break;
    }
    return;
});
world.afterEvents.entityDie.subscribe(data => {
    const entity = data.deadEntity;
    const entityType = entity?.typeId;
    if (entity?.isValid()) {
        const location = entity?.location;
        if (entityType === 'minecraft:player') {
            const particlePlayer = entity.dimension.getEntities({ type: 'rza:particle_player', tags: [`${entity.id}`], location, closest: 1, maxDistance: 8 })[0];
            if (particlePlayer) {
                particlePlayer.remove();
            }
        }
    }
    else
        return;
}, { entityTypes: ['minecraft:player'] });
world.afterEvents.dataDrivenEntityTrigger.subscribe(data => {
    const entity = data.entity;
    const eventId = data.eventId;
    if (!entity?.isValid()) {
        return;
    }
    if (eventId === "rza:play_particles") {
        try {
            const player = world.getAllPlayers().find(p => p.id === entity.getTags()[0]);
            if (entity.typeId === "rza:particle_player") {
                if (player) {
                    player.onScreenDisplay.setActionBar(`Particle check (ID: ${entity.id}, Active: ${entity.getProperty("rza:particle_active")}, Length: ${entity.getProperty("rza:effect_length")}, Length2: ${entity.getProperty("rza:effect2_length")})`);
                }
                const nearbyActivePlayers = entity.dimension.getEntities({
                    type: 'rza:particle_player',
                    location: entity.location,
                    maxDistance: 24
                }).filter(p => p.id !== entity.id &&
                    p.getProperty("rza:particle_active") === true);
                if (nearbyActivePlayers.length > 0) {
                    console.warn(`Found ${nearbyActivePlayers.length} nearby active particle players: ${nearbyActivePlayers.map(p => p.id).join(', ')}`);
                    const activePlayer = nearbyActivePlayers[0];
                    if (activePlayer?.isValid()) {
                        const activeLength = activePlayer.getProperty("rza:effect_length");
                        if (activeLength > 0) {
                            activePlayer.dimension.spawnParticle(DUST_STORM_PARTICLE, activePlayer.location);
                            activePlayer.setProperty("rza:effect_length", activeLength - 1);
                            return;
                        }
                    }
                }
                if (nearbyActivePlayers.length === 0) {
                    try {
                        const currentLength = entity.getProperty("rza:effect_length");
                        const isActive = entity.getProperty("rza:particle_active");
                        const effect2Length = entity.getProperty("rza:effect2_length");
                        if (isActive && currentLength > 0) {
                            entity.dimension.spawnParticle(DUST_STORM_PARTICLE, entity.location);
                            if (effect2Length > 0) {
                                entity.dimension.spawnParticle(DUST_STORM2_PARTICLE, entity.location);
                                entity.setProperty("rza:effect2_length", effect2Length - 1);
                            }
                            else if (Math.random() < SECOND_EFFECT_CHANCE) {
                                const newEffect2Length = Math.max(2, Math.floor(Math.random() * (currentLength - 2)));
                                entity.setProperty("rza:effect2_length", newEffect2Length);
                            }
                            const newLength = Math.max(currentLength - 1, 0);
                            entity.setProperty("rza:effect_length", newLength);
                            if (newLength === 0) {
                                entity.setProperty("rza:particle_active", false);
                                entity.setProperty("rza:effect2_length", 0);
                            }
                        }
                        else if (!isActive && currentLength === 0 && Math.random() < FIRST_EFFECT_CHANCE) {
                            const effectLength = Math.floor(Math.random() * 5001) + 1000;
                            entity.setProperty("rza:effect_length", effectLength);
                            entity.setProperty("rza:particle_active", true);
                        }
                    }
                    catch (error) {
                        console.error(`Particle error: ${error}`);
                        entity.setProperty("rza:particle_active", false);
                        entity.setProperty("rza:effect2_length", 0);
                    }
                }
            }
        }
        catch (error) {
            console.error(`Particle event error: ${error}`);
        }
    }
});
system.runTimeout(() => {
    system.runInterval(() => {
        try {
            const players = world.getAllPlayers();
            for (const player of players) {
                if (!player?.isValid() || player.dimension.id !== "minecraft:overworld") {
                    continue;
                }
                const headLocation = player.getHeadLocation();
                const viewVector = player.getViewDirection();
                const offsetLocation = {
                    x: headLocation.x - viewVector.x * 2,
                    y: headLocation.y - viewVector.y * 2,
                    z: headLocation.z - viewVector.z * 2
                };
                const dimension = player.dimension;
                const particlePlayer = dimension.getEntities({ type: 'rza:particle_player', tags: [`${player.id}`], location: headLocation, closest: 1, maxDistance: 16 })[0];
                if (!particlePlayer) {
                    dimension.spawnEntity("rza:particle_player", offsetLocation).addTag(`${player.id}`);
                }
                else {
                    particlePlayer.teleport(offsetLocation);
                    const nearbyParticlePlayers = dimension.getEntities({
                        type: 'rza:particle_player',
                        tags: [`${player.id}`],
                        location: headLocation,
                        maxDistance: 16
                    });
                    if (nearbyParticlePlayers.length > 1) {
                        for (let i = 1; i < nearbyParticlePlayers.length; i++) {
                            const extraPlayer = nearbyParticlePlayers[i];
                            if (extraPlayer && extraPlayer.isValid()) {
                                extraPlayer.remove();
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error(`Interval error: ${error}`);
        }
    }, 1);
    return;
}, 100);
