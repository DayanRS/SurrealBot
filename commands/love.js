const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "love",
		description: "Check how much someone loves you",
		options: [
			{
				name: "lover",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The name of the lover",
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const lover = interaction.options.getUser("lover");
		const commandUser = interaction.member;	//as GuildMember
		
		if(!lover || lover.username == commandUser.user.username) {
			await interaction.editReply({
				content: `${commandUser} loves themself 100%: ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️`
			});
			
			return;
		}
		
		let lovePercentage = Math.round(Math.random() * 100);
		let numHearts = Math.round(lovePercentage / 10);
		let loveString = "💖".repeat(numHearts) + "💔".repeat(10 - numHearts);
		
		await interaction.editReply({
			content: `${commandUser} loves ${lover} ${lovePercentage}%: ${loveString}`
		});
	}
};