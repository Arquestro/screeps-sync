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

if (Game.spawns['Spawn1'].room.controller.level == 1) {
    module.exports.loop = loopRCL1;
} else {
    module.exports.loop = loopRCLGT1;
}

function commonRoutine () {
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

function loopRCL1 () {
    var creep_quota_prioritized_list = [
        {'quota_role': 'upgrader', 'quota_limit': 2, 'body': [WORK, WORK, MOVE, CARRY]},
    ];
    qm.satisfy_prioritized_quota(creep_quota_prioritized_list);
    commonRoutine();
}


function buildAtMainSpawn(offset_x, offset_y, structure_type) {
    Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos.x + offset_x, Game.spawns['Spawn1'].pos.y + offset_y, structure_type);
}

function loopRCLGT1 () {
    var creep_quota_prioritized_list = [
        {'quota_role': 'harvester', 'quota_limit': 5, 'body': [WORK, WORK, MOVE, CARRY]},
        {'quota_role': 'upgrader', 'quota_limit': 2, 'body': [WORK, WORK, MOVE, CARRY]},
        {'quota_role': 'builder', 'quota_limit': 5, 'body': [WORK, WORK, MOVE, CARRY]}
    ];
    qm.satisfy_prioritized_quota(creep_quota_prioritized_list);
    var pts = [[2, 1], [1, 2], [0, 2], [-1, 2], [-2, 2]];
    for(let i = 0; i < pts.length; ++i) {
        buildAtMainSpawn(pts[i][0], pts[i][1], STRUCTURE_EXTENSION);
    }
    commonRoutine();
}