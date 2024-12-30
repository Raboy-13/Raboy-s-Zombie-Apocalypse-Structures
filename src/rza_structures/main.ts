import { system, world } from "@minecraft/server";
import { summonInhabitants, summonVillager, summonAnimals, summonSheep, summonButcherAnimals } from "./illager_settlement/inhabitants";
import { initIllagerTowerTurrets, spawnTowerGuards } from "./illager_settlement/buildings/illagerTower";

// Particle effect constants
const DUST_STORM_PARTICLE = "rza:dust_storm";
const DUST_STORM2_PARTICLE = "rza:dust_storm2";
const FIRST_EFFECT_CHANCE = 0.001; // 0.1% chance
const SECOND_EFFECT_CHANCE = 0.003; // 0.3% chance

// General script event listener
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
    else return;
}, {entityTypes: ['minecraft:player']});

world.afterEvents.dataDrivenEntityTrigger.subscribe(data => {
    const entity = data.entity;
    const eventId = data.eventId;

    // Check if entity is valid before processing
    if (!entity?.isValid()) {
        return;
    }

    // Handle player particles event
    if (eventId === "rza:play_particles") {
        try {
            // Get the associated player for this particle player
            const player = world.getAllPlayers().find(p => p.id === entity.getTags()[0]);

            // Check if entity is a particle player
            if (entity.typeId === "rza:particle_player") {
                // Show debug info about current state
                if (player) {
                    player.onScreenDisplay.setActionBar(
                        `Particle check (ID: ${entity.id}, Active: ${entity.getProperty("rza:particle_active")}, Length: ${entity.getProperty("rza:effect_length")}, Length2: ${entity.getProperty("rza:effect2_length")})`
                    );
                }

                // Check for other active particle players in 24-block radius that aren't this player
                const nearbyActivePlayers = entity.dimension.getEntities({
                    type: 'rza:particle_player',
                    location: entity.location,
                    maxDistance: 24
                }).filter(p =>
                    p.id !== entity.id &&
                    p.getProperty("rza:particle_active") === true
                );

                // If there are other active players, continue their effects
                if (nearbyActivePlayers.length > 0) {
                    console.warn(`Found ${nearbyActivePlayers.length} nearby active particle players: ${nearbyActivePlayers.map(p => p.id).join(', ')}`);
                    const activePlayer = nearbyActivePlayers[0];
                    if (activePlayer?.isValid()) {
                        const activeLength = activePlayer.getProperty("rza:effect_length") as number;
                        if (activeLength > 0) {
                            // Continue playing particles for the active player
                            activePlayer.dimension.spawnParticle(DUST_STORM_PARTICLE, activePlayer.location);
                            activePlayer.setProperty("rza:effect_length", activeLength - 1);
                            return;
                        }
                    }
                }

                // Only proceed if no other active particle players are found
                if (nearbyActivePlayers.length === 0) {
                    // Handle particle effects directly since event is called every tick
                    try {
                        const currentLength = entity.getProperty("rza:effect_length") as number;
                        const isActive = entity.getProperty("rza:particle_active") as boolean;
                        const effect2Length = entity.getProperty("rza:effect2_length") as number;

                        if (isActive && currentLength > 0) {
                            // Play primary dust storm particle
                            entity.dimension.spawnParticle(DUST_STORM_PARTICLE, entity.location);

                            // Handle secondary particle effect
                            if (effect2Length > 0) {
                                entity.dimension.spawnParticle(DUST_STORM2_PARTICLE, entity.location);
                                entity.setProperty("rza:effect2_length", effect2Length - 1);
                            } else if (Math.random() < SECOND_EFFECT_CHANCE) {
                                // Start secondary effect with length at least 2 ticks less than primary
                                const newEffect2Length = Math.max(2, Math.floor(Math.random() * (currentLength - 2)));
                                entity.setProperty("rza:effect2_length", newEffect2Length);
                            }

                            // Decrement effect length and update property
                            const newLength = Math.max(currentLength - 1, 0);
                            entity.setProperty("rza:effect_length", newLength);

                            // Deactivate particles when length reaches 0
                            if (newLength === 0) {
                                entity.setProperty("rza:particle_active", false);
                                entity.setProperty("rza:effect2_length", 0);
                            }
                        }
                        else if (!isActive && currentLength === 0 && Math.random() < FIRST_EFFECT_CHANCE) {
                            // Set random effect length between 1000-6000 ticks
                            const effectLength = Math.floor(Math.random() * 5001) + 1000;
                            entity.setProperty("rza:effect_length", effectLength);
                            entity.setProperty("rza:particle_active", true);
                        }
                    } catch (error) {
                        console.error(`Particle error: ${error}`);
                        entity.setProperty("rza:particle_active", false);
                        entity.setProperty("rza:effect2_length", 0);
                    }
                }
            }
        } catch (error) {
            console.error(`Particle event error: ${error}`);
        }
    }
});

// Setup a delayed interval system
system.runTimeout(() => {
    system.runInterval(() => {
        try {
            const players = world.getAllPlayers();
            for (const player of players) {
                // Validate player and ensure they're in overworld
                if (!player?.isValid() || player.dimension.id !== "minecraft:overworld") {
                    continue;
                }
                const headLocation = player.getHeadLocation();
                const viewVector = player.getViewDirection();
                // Calculate position 0.5 blocks behind head
                const offsetLocation = {
                    x: headLocation.x - viewVector.x * 2,
                    y: headLocation.y - viewVector.y * 2,
                    z: headLocation.z - viewVector.z * 2
                };
                const dimension = player.dimension;
                const particlePlayer = dimension.getEntities({ type: 'rza:particle_player', tags: [`${player.id}`], location: headLocation, closest: 1, maxDistance: 16 })[0];
                if (!particlePlayer) {
                    // Summon the player's particle player
                    dimension.spawnEntity("rza:particle_player", offsetLocation).addTag(`${player.id}`);
                }
                else {
                    particlePlayer.teleport(offsetLocation);
                    
                    // Check for duplicate particle players
                    const nearbyParticlePlayers = dimension.getEntities({
                        type: 'rza:particle_player',
                        tags: [`${player.id}`],
                        location: headLocation,
                        maxDistance: 16
                    });
                    
                    // If more than one exists, remove extras
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
        } catch (error) {
            console.error(`Interval error: ${error}`);
        }
    }, 1); // Run every tick

    // Return to properly exit the timeout
    return;
}, 100);
