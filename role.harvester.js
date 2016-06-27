var creepLogger = require('creepLogger');
var sourceFinder = require('sourceFinder');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.fueling && creep.carry.energy == 0) {
            creep.memory.fueling = false;
        }
        if (!creep.memory.fueling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fueling = true;
        }

        if (creep.memory.fueling) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                }
            });
            if (!targets.length) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_ROAD ||
                                structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity;
                    }
                });
            }
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creepLogger.logStatus(creep, "moving to structure " + targets[0].structureType);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
        else {
            sourceFinder.moveCreepToSource(creep);
        }
    }
};

module.exports = roleHarvester;