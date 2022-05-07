const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Test command."),
		
	async execute(interaction) {
		await interaction.reply("Test2");
	}
};