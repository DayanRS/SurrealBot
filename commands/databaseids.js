const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "databaseids",
		description: "Database maintenance",
		options: [{
			name: "type",
			type: Constants.ApplicationCommandOptionTypes.INTEGER,
			description: "Type of update to check for",
			required: true
		}]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const updateType = interaction.options.getInteger("type", true);
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		if(updateType < 0 || updateType > 1) {
			await interaction.editReply({
				content: "Type out of bounds",
				ephemeral: true
			});
			return;
		}
		
		const db = require("../services/db");
		
		let results = await db.appendField(updateType);
		
		//console.log(results);
		
		if(results === null) {
			await interaction.editReply(`No IDs need forced updating (${updateType})`);
			return;
		}
		
		let searchString = `**ADDED ID** for ${results.userId} in ${results.guildId}:\n`;
		
		for(let i = 0; i < results.warnings.length; i++) {
			searchString += results.warnings[i].reason + ": " + results.warnings[i].refId + "\n";
		}
		
		await interaction.editReply(searchString);
	}
};
