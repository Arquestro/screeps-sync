function satisfy_quota(quota_role, quota_limit, body) {
    var creeps = _.filter(Game.creeps, { memory: {role: quota_role}});
    if(creeps.length < quota_limit) {
        var success =  Game.spawns['Spawn1'].spawnCreep(body, quota_role + Game.time, {memory : {role : quota_role}});
        if(success == OK) { 
            console.log("Spawning " + quota_role);
            return success;
        }
    }
}

var managersQuota = {
    satisfy_prioritized_quota: function(creep_list) {
        for(let i = 0; i < creep_list.length; ++i) {
            var is_spawning = satisfy_quota(creep_list[i]['quota_role'], creep_list[i]['quota_limit'], creep_list[i]['body']);
            if(is_spawning == OK) break;
        }
    }
}
module.exports = managersQuota;