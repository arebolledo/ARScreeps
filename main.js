var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFixer = require('role.fixer');
var creepSpawner = require('creepSpawner');
var creepLogger = require('creepLogger');
var sourceFinder = require('sourceFinder');

module.exports.loop = function () {

    //var tower = Game.getObjectById('id477040');
    //if(tower) {
    //    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //        filter: (structure) => structure.hits < structure.hitsMax
    //    });
    //    if(closestDamagedStructure) {
    //        tower.repair(closestDamagedStructure);
    //    }

    //    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //    if(closestHostile) {
    //        tower.attack(closestHostile);
    //    }
    //}

    var room;
    for (i in Game.spawns) {
        room = Game.spawns[i].room;
    }

    var sources = room.find(FIND_SOURCES);
    for (i in sources) {
        sourceFinder.getNumberOfFreeSpaces(sources[i]);
    }

    console.log(Game.time);
    creepSpawner.run();
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.name == 'Samuel') {
        //    var sources = creep.room.find(FIND_SOURCES);
        //    sourceFinder.getNumberOfFreeSpaces(sources[0]);
        //    sourceFinder.getNumberOfFreeSpaces(sources[1]);
            creep.memory.role = 'harvester';
        }
        //if (creep && creep.memory) {
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        }
        //}
    }
    console.log("Free sources: " + sourceFinder.getTotalNumberOfFreeSpaces(room));

}