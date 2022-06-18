const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "checkcustom",
		description: "Lists all custom commands",
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		console.log(interaction.client.customCommands[interaction.guildId]);
		
		const guildCustomCommands = interaction.client.customCommands[interaction.guildId];
		
		let customCommandKeys;
		
		if(!guildCustomCommands || (customCommandKeys = Object.keys(guildCustomCommands)).length === 0) {	//guild doesn't have any custom commands
			interaction.editReply("This guild doesn't currently have any custom commands");
			return;	
		}
		
		interaction.editReply("Custom commands:\n" + customCommandKeys.toString().replaceAll(",", ", "));
	}
};