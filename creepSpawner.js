var sourceFinder = require('sourceFinder');

module.exports = {
    run: function () {

        var room;
        for (i in Game.spawns) {
            room = Game.spawns[i].room;
        }

        var extensions = room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_EXTENSION
        });

        var power = 300;
        if (extensions.length) {
            power += extensions.length * 50;
        }
        //console.log("Power " + power);

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer');
        //console.log(Game.creeps);
        //var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //console.log('Harvesters: ' + harvesters.length);

        if (harvesters.length < 5) {
            var newName = Game.spawns.Spawn1.createCreep(getWorkerBody(power), undefined, { role: 'harvester' });
            console.log('Spawning new harvester: ' + newName);
            return;
        }
        if (builders.length < 4) {
            var newName = Game.spawns.Spawn1.createCreep(getWorkerBody(power), undefined, { role: 'builder' });
            console.log('Spawning new builder: ' + newName);
            return;
        }
        if (upgraders.length < 3) {
            var newName = Game.spawns.Spawn1.createCreep(getWorkerBody(power), undefined, { role: 'upgrader' });
            console.log('Spawning new upgrader: ' + newName);
            return;
        }
        if (repairers.length < 2) {
            var newName = Game.spawns.Spawn1.createCreep(getWorkerBody(power), undefined, { role: 'fixer' });
            console.log('Spawning new fixer: ' + newName);
            return;
        }
        if (sourceFinder.getTotalNumberOfFreeSpaces(room) > 0) {
            // Default
            var newName = Game.spawns.Spawn1.createCreep(getWorkerBody(power), undefined, { role: 'harvester' });
            console.log('Spawning new harvester: ' + newName);
        }
    }
}

function getWorkerBody(power) {
    var bodyPriority = [WORK, WORK, CARRY, MOVE, CARRY, MOVE, WORK, MOVE, WORK];
    var remainingPower = power;
    var bodyArray = [];
    for (var i in bodyPriority) {
        var body = bodyPriority[i];
        if (body == WORK) {
            remainingPower -= 100;
        }
        else if (body == MOVE || body == CARRY) {
            remainingPower -= 50;
        }
        bodyArray.push(body);
        if (remainingPower <= 0) {
            break;
        }
    }
    return bodyArray;
}