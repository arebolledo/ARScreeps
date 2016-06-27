var creepLogger = require('creepLogger');
var sourceFinder = require('sourceFinder');
var roleHarvester = require('role.harvester');

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
            var targets = creep.room.find(FIND_STRUCTURES);
            //console.log(targets.length);
            targets = _.filter(targets, (target) => target.hits < target.hitsMax && target.structureType != STRUCTURE_WALL);
            //console.log(targets.length);

            if (targets.length) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creepLogger.logStatus(creep, "moving to structure " + targets[0].structureType);
                }
                else {
                    creepLogger.logStatus(creep, "is fixing structure " + targets[0].structureType);
                }
            }
            else {
                roleHarvester.run(creep);
            }
        }
        else {
            sourceFinder.moveCreepToSource(creep);
        }
    }
};

module.exports = roleBuilder;