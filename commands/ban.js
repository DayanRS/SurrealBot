const { Constants, CommandInteraction } = require("discord.js");

module.exports = {
	data: {
		name: "sban21",
		description: "Ban user from the server",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to ban",
				required: true
			},
			{
				name: "reason",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The reason for banning them",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		const args = interaction.options.data;
		
		const userToBan = interaction.options.getUser("user", true);
		const banReason = interaction.options.getString("reason", true);
		
		const banString = `
			**Banned user:** <@${userToBan.id}> (${userToBan.id})
			**Reason:** ${banReason}
			**Duration:** N/A
			**Staff member:** ${interaction.member.user.username}
		`.replaceAll("\t","");
		
		await interaction.reply(banString);
	}
};