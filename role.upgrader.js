var creepLogger = require('creepLogger');
var sourceFinder = require('sourceFinder');
var _ = require('lodash');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                creepLogger.logStatus(creep, "moving to controller");
            }
            else {
                creepLogger.logStatus(creep, "is upgrading controller");
            }
        }
        else {
            sourceFinder.moveCreepToSource(creep);
        }
    }
};

module.exports = roleUpgrader;