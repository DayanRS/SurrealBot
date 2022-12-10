const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "databaseids",
		description: "Database maintenance",
		options: []
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		const db = require("../services/db");
		
		let results = await db.appendField();
		
		//console.log(results);
		
		if(results === null) {
			await interaction.editReply("No IDs need forced updating");
			return;
		}
		
		let searchString = `**ADDED ID** for ${results.userId} in ${results.guildId}:\n`;
		
		for(let i = 0; i < results.warnings.length; i++) {
			searchString += results.warnings[i].reason + ": " + results.warnings[i].refId + "\n";
		}
		
		await interaction.editReply(searchString);
	}
};
