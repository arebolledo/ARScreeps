var creepLogger = require('creepLogger');
var sourceFinder = require('sourceFinder');
var roleFixer = require('role.fixer');

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_EXTENSION;
                }
            });
            if (!targets.length) {
                targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            }
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creepLogger.logStatus(creep, "moving to structure " + targets[0].structureType);
                }
                else {
                    creepLogger.logStatus(creep, "is building structure " + targets[0].structureType);
                }

            }
            else {
                roleFixer.run(creep);
            }
        }
        else {
            sourceFinder.moveCreepToSource(creep);
        }
    }
};

module.exports = roleBuilder;