const { Constants, Permissions } = require("discord.js");
module.exports = {
	data: {
		name: "ghostwrite",
		description: "Become an impostor sus",
		options: [
			// {
			// 	name: "channel",
			// 	type: Constants.ApplicationCommandOptionTypes.CHANNEL,
			// 	description: "The channel in which to send the message",
			// 	required: true
			// },
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
		
		// const channel = interaction.options.getChannel("channel");
		let message = interaction.options.getString("message");

		const generalChannelID = 411605881336365068;
		const channel = interaction.guild.channels.cache.get(generalChannelID);

		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}

		message = message.replace(/(@everyone|@here)/gmi, "")

		const impostorMsg = await channel.send({ content: message });

		await interaction.editReply({
			content: `Impostor activities finished with success. Message link: ${impostorMsg.url}`
		});
	}
};