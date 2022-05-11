const db = require("../services/db");

module.exports = {
	async checkPunishments() {
		process.stdout.write("Checking for expired punishments...");
		
		let punishes = await db.findAll(db.PUNISHES);
		
		console.log(` (${punishes.length})`)
		for(let i = 0; i < punishes.length; i++) {		//check all entries for expired punishments
			let timeDiff = (Date.now() - punishes[i].time)/1000;	//in seconds
			
			if(timeDiff > punishes[i].duration) {
				console.log(`Punish time up for id: ${punishes[i].userId}`);
				module.exports.removePunishment(punishes[i]);
			}
		}
	},
	
	async removePunishment(punishObj) {
		const client = require("../index");
		
		const guild = await client.guilds.fetch(punishObj.guildId);
		const userToUnpunish = await guild.members.fetch(punishObj.userId);	//userToUnpunish
		const punishRole = (await guild.roles.fetch()).filter((role) => role.name === "Punished");
		
		await userToUnpunish.roles.remove(punishRole);
		
		const deleteObj = {};
		
		if(punishObj._id) deleteObj._id = punishObj._id;	//prioritise delete by database id
		else deleteObj.userId = punishObj.userId;
		
		db.deleteOne(db.PUNISHES, deleteObj);
		
		console.log(`Punish role removed for ${userToUnpunish.user.username}`);
	}
};