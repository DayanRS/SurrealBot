const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "sban21",
		description: "Ban user from the server",
		options: [
			{
				name: "username",
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
		//const args = interaction.options.data;
		const userToBan = interaction.options.getUser("username", true);
		const banReason = interaction.options.getString("reason", true);
		
		//TODO: Implement ban logic
		//-Check permissions
		//-User validation (in server, not self, not same/higher role, etc)
		//-Send message to user
		//-Send message in log channel
		//-Execute the ban
		
		const banString = `
			**Banned user:** <@${userToBan.id}> (${userToBan.id})
			**Reason:** ${banReason}
			**Duration:** Permanent
			**Staff member:** ${interaction.member.user.username}
		`.replaceAll("\t","");
		
		await interaction.reply(banString);
	}
};