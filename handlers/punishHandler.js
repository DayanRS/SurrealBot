const db = require("../services/db");
const client = require("../index");

let ignoreList = [];	//guilds to ignore punishments from

module.exports = {
	async checkPunishments(userToCheck) {	//optional obj with userId and guildId to check if should be punished but isn't
		let userCheckResult = null;
		
		process.stdout.write(`${client.getTimeString()}Checking for expired punishments...`);
		
		const punishes = await db.findAll(db.PUNISHES);	//list of punishes in DB
		
		client._log(` (${punishes.length})`);	//TODO: handle ignores properly
		
		for(let i = 0; i < punishes.length; i++) {		//check all entries for expired punishments
			let timeDiff = (Date.now() - punishes[i].time)/1000;	//in seconds
			
			if(ignoreList.indexOf(punishes[i].guildId) >= 0) continue;
			
			//console.log(punishes[i].userId + " (714857399328178268)");	//TEMP (TODO #1)
			
			if(timeDiff > punishes[i].duration) {	//punish expired
				console.log(`Punish time up for id: ${punishes[i].userId}`);
				module.exports.removePunishment(punishes[i], "Expired");
				
			} else {	//punish not expired
				let guild;
				
				try {
					guild = await client.guilds.fetch(punishes[i].guildId);
				} catch(err) {
					console.log(`Error reapplying punishment - could not find guild ID: ${punishes[i].guildId}`);
					ignoreList.push(punishes[i].guildId);
					continue;
				}
				
				try {
					const punishRole = ((await guild.roles.fetch()).filter((role) => role.name === "Punished")).at(0);
					const punishedMembers = punishRole.members;		//list of users with punished role
					
					if(!punishedMembers.has(punishes[i].userId)) {	//user doesn't have punished role
						await guild.members.resolve(punishes[i].userId).roles.set([punishRole]);	//give them the role again!
						//console.log(guild.members.resolve(punishes[i].userId).roles);	//TEMP (TODO #1)
						if(userToCheck && userToCheck.guildId == punishes[i].guildId && userToCheck.userId == punishes[i].userId) userCheckResult = punishes[i];
					}
				} catch(err) {
					//console.log(err.message);	//TEMP (TODO #1)
					//console.log(err);
					//console.log(guild.members.cache);	//TEMP (TODO #1)
					//probably not a member of the guild
				}
			}
		}
		
		return userCheckResult;
	},
	
	async removePunishment(punishObj, status) {
		let guild;
		
		try {
			guild = await client.guilds.fetch(punishObj.guildId);
		} catch(err) {
			console.log(`Error removing punishment - could not find guild ID: ${punishObj.guildId}`);
			ignoreList.push(punishObj.guildId);
			return;
		}
		
		try {
			const userToUnpunish = await guild.members.fetch(punishObj.userId);
			await userToUnpunish.roles.set(punishObj.roles);	//give their roles back
			
			console.log(`Punish role removed for ${userToUnpunish.user.username}`);
			
		} catch(err) {	//user likely no longer in guild
			console.log(`Error removing punishment for ${punishObj.userId}: ${err.message}`);
		}
		
		const deleteObj = {};
		
		if(punishObj._id) deleteObj._id = punishObj._id;	//prioritise delete by database id
		else deleteObj.userId = punishObj.userId;
		
		await db.deleteOne(db.PUNISHES, deleteObj);
		
		await db.findOneAndUpdate(db.WARNINGS, {
			guildId: punishObj.guildId,
			userId: punishObj.userId,
			warnings: [
				{
					time: Date.now(),
					reason: punishObj.reason,
					staff: punishObj.staff,
					type: "Punishment",
					status: status,
					roles: punishObj.roles
				}
			]
		});
	},
	
	async removeCustomPunishment(punishInfo) {	//guildId and userId
		let punishObj = await db.findOne(db.PUNISHES, punishInfo);
		if(!punishObj) return false;
		
		await this.removePunishment(punishObj, "Quashed");
		
		return true;
	}
};