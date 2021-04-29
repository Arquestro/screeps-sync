var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var _ = require('lodash')
var qm = require('managers.quota')

var callback_dict = {
    'harvester': roleHarvester.run,
    'builder': roleBuilder.run,
    'upgrader': roleUpgrader.run,
}

module.exports.loop = function () {
    qm.satisfy_quota('harvester', 10, [WORK, MOVE, CARRY])
    qm.satisfy_quota('upgrader', 5, [WORK, MOVE, CARRY])
    qm.satisfy_quota('builder', 1, [WORK, MOVE, CARRY])
    
    var tower = Game.getObjectById('e2f2dfd8dd2e8d247e66bdbd');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        callback_dict[creep.memory.role](creep);
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}