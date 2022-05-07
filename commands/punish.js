const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "punish",
		description: "Temporarily punish user",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to punish",
				required: true
			},
			{
				name: "reason",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The reason for punishing them",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		//const args = interaction.options.data;
		const userToPunish = interaction.options.getUser("user", true);
		const punishReason = interaction.options.getString("reason", true);
		
		//TODO: The actual punish logic
		
		const punishString = `
			**Punished user:** <@${userToPunish.id}> (${userToPunish.id})
			**Reason:** ${punishReason}
			**Duration:** N/A
			**Staff member:** ${interaction.member.user.username}
		`.replaceAll("\t","");
		
		await interaction.reply(punishString);
	}
};
