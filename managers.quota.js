var managersQuota = {
	satisfy_quota: function(quota_role, quota_limit, body) {
	    var creeps = _.filter(Game.creeps, { memory: {role: quota_role}});
	    if(creeps.length < quota_limit) {
            var success =  Game.spawns['Spawn1'].spawnCreep(body, quota_role + Game.time, {memory : {role : quota_role}});
            if(success == OK) console.log("Spawning " + quota_role);
        }
	}
}
module.exports = managersQuota;