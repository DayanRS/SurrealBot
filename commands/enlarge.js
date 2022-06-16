const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "enlarge",
		description: "Enlarges an emoji",
		options: [
			{
				name: "emoji",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The emoji you want to enlarge",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		const emoji = interaction.options.getString("emoji");
		
		if(emoji.length <= 2) {
			await interaction.reply("Could not enlarge basic emoji.");
			return;
		}
		
		let emojiUrl = this.getEmoji(emoji);
		
		await interaction.reply({
			content: `${emojiUrl}`
		});
	},
	
	getEmoji(id) {
		let isAnimated = id.charAt(1) == 'a';
		let emojiId = /:(\d+)>/g.exec(id);
		return `https://cdn.discordapp.com/emojis/${emojiId[1]}.${ isAnimated ? "gif" : "png" }?size=4096&quality=lossless`;
	}
};