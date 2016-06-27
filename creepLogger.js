module.exports = {
    logStatus: function (creep, description) {
        console.log(creep.name + " (" + creep.memory.role + ") " + description);
    }
};