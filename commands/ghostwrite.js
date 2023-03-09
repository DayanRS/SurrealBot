const { Constants } = require("discord.js");
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
	data: {
		name: "ghostwrite",
		description: "Become an impostor sus",
		defaultMemberPermissions: Number(PermissionFlagsBits.KickMembers),
		options: [
			{
				name: "channel",
				type: Constants.ApplicationCommandOptionTypes.CHANNEL,
				description: "The channel in which to send the message",
				required: true
			},
			{
				name: "message",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The message to send",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const channel = interaction.options.getChannel("channel");
		let message = interaction.options.getString("message");

		message = message.replace(/(@everyone|@here)/gmi, "")

		await channel.send({ content: message });
	}
};