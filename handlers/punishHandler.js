const db = require("../services/db");
const client = require("../index");

module.exports = {
	async checkPunishments() {
		process.stdout.write(`${client.getTimeString()}Checking for expired punishments...`);
		
		const punishes = await db.findAll(db.PUNISHES);	//list of punishes in DB
		
		client._log(` (${punishes.length})`);
		
		for(let i = 0; i < punishes.length; i++) {		//check all entries for expired punishments
			let timeDiff = (Date.now() - punishes[i].time)/1000;	//in seconds
			
			if(timeDiff > punishes[i].duration) {	//punish expired
				console.log(`Punish time up for id: ${punishes[i].userId}`);
				module.exports.removePunishment(punishes[i]);
				
			} else {	//punish not expired
				const guild = await client.guilds.fetch(punishes[i].guildId);
				const punishRole = ((await guild.roles.fetch()).filter((role) => role.name === "Punished")).at(0);
				const punishedMembers = punishRole.members;		//list of users with punished role
				
				try {
					if(!punishedMembers.has(punishes[i].userId)) {	//user doesn't have punished role
						await guild.members.resolve(punishes[i].userId).roles.set([punishRole]);	//give them the role again!
					}
				} catch(err) {
					//probably not a member of the guild
				}
			}
		}
	},
	
	async removePunishment(punishObj) {
		const guild = await client.guilds.fetch(punishObj.guildId);
		
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
	},
	
	async removeCustomPunishment(punishInfo) {	//guildId and userId
		let punishObj = await db.findOne(db.PUNISHES, punishInfo);
		if(!punishObj) return false;
		
		await this.removePunishment(punishObj);
		
		return true;
	}
};