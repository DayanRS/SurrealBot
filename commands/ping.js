module.exports = {
	data: {
		name: "ping",
		description: "test command!!"
	},
	async execute(interaction) {
		await interaction.reply("Test4");
	}
};