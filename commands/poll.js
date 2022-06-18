const { Constants, MessageEmbed } = require("discord.js");

module.exports = {
	data: {
		name: "poll",
		description: "Create a poll with custom text",
		options: [
			{
				name: "message",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "What are you polling?",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const pollMsg = interaction.options.getString("message");
		const commandUser = interaction.member;	//as GuildMember
		
		const embedMessage = new MessageEmbed()
			.setColor("#ff9b00")
			.setTitle(pollMsg)
			.setDescription("Polled by " + commandUser.displayName);
		
		const pollInteraction = await interaction.editReply({ embeds: [embedMessage], fetchReply: true });
		
		await pollInteraction.react("✅");
		await pollInteraction.react("⛔");
	}
};