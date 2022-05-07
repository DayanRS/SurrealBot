const { Constants, CommandInteraction } = require("discord.js");

module.exports = {
	data: {
		name: "sban11",
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
				description: "The user to ban",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		const args = interaction.options.data;
		
		console.log(args);
		console.log(interaction.options.getString("reason", true));
		
		await interaction.reply("Ban hammer: ");
	}
};