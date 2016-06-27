var creepLogger = require('creepLogger');
var _ = require('lodash');

function getNumberOfFreeSpaces(source, creep) {
    var position = source.pos;
    var adjX = [position.x - 1, position.x, position.x + 1];
    var adjY = [position.y - 1, position.y, position.y + 1];
    var wallCreepCount = 0;
    //console.log(adjX);
    for (var x in adjX) {
        for (var y in adjY) {
            var adj = new RoomPosition(adjX[x], adjY[y], source.room.name);
            if (adj.x != position.x || adj.y != position.y) {
                var stuff = adj.look();
                for (var i in stuff) {
                    if ((stuff[i].type == 'terrain' && stuff[i].terrain == 'wall')
                        || (stuff[i].type == 'creep' && (!creep || (creep.pos.x != adj.x && creep.pos.y != adj.y)))) {
                        //console.log(stuff[i].terrain);
                        wallCreepCount++;
                    }
                }
            }
        }
    }
    var spaces = 8 - wallCreepCount
    //console.log(spaces + " spaces found");
    return spaces;
}

function getTotalNumberOfFreeSpaces(room) {
    var sources = room.find(FIND_SOURCES);
    return _.sum(sources, source => getNumberOfFreeSpaces(source));
}
// JavaScript source code
module.exports = {
    moveCreepToSource: function (creep) {
        var source;
        if (!creep.memory.destSourceID) {
            var sources;
            if (!creep.room.memory.sources) {

                var sources = creep.room.find(FIND_SOURCES);
                sources = _.filter(sources, x => getNumberOfFreeSpaces(x, creep) > 0);
                sources = _.sortBy(sources, x => creep.room.findPath(creep.pos, x.pos, { ignoreCreeps: false, ignoreRoads: false }).length);
            }

            //sources = _.sortBy(sources, 'energy');
            source = sources[0];//_.last(sources);
            if (!source) {
                console.log("No sources available");
                return;
            }
            else {
                creep.memory.destSourceID = source.id;
            }
            //console.log("Acquisition: " + creep.name);
        }
        else {
            source = Game.getObjectById(creep.memory.destSourceID);
        }
        //console.log(source.pos);
        // Cheap h4x
        //if (creep.memory.role == 'upgrader') {
        //    source = sources[1];
        //}
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            creepLogger.logStatus(creep, "is moving to energy " + source.pos);
        }
        else {
            creepLogger.logStatus(creep, "is sucking energy" + source.pos);
            creep.memory.destSourceID = null;
        }
    },
    getNumberOfFreeSpaces: getNumberOfFreeSpaces,
    getTotalNumberOfFreeSpaces: getTotalNumberOfFreeSpaces

};