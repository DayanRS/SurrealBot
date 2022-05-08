const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "spunish",
		description: "Temporarily punish user",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to punish",
				required: true
			},
			{
				name: "duration",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The punishment duration",
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
		const userToPunish = interaction.options.getUser("user", true);
		const punishDuration = interaction.options.getString("duration", true);
		const punishReason = interaction.options.getString("reason", true);
		
		//TODO: The actual punish logic
		//Permissions.FLAGS.MUTE_MEMBERS
		
		const punishString = `
			**Punished user:** <@${userToPunish.id}> (${userToPunish.id})
			**Reason:** ${punishReason}
			**Duration:** N/A
			**Staff member:** ${interaction.member.user.username}
		`.replaceAll("\t","");
		
		await interaction.reply(punishString);
	}
};
