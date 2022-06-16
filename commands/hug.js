const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "hug",
		description: "Hug someone!",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user who you want to hug",
			}
		]
	},
	
	async execute(interaction) {
		const hugTarget = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		
		if(!hugTarget || hugTarget.username == commandUser.user.username) {
			await interaction.reply({
				content: `${commandUser} hugged themselves lol`
			});
			return;
		}
		
		await interaction.reply({
			content: `<@${hugTarget.id}> you have been hugged by <@${commandUser.user.id}> ❤️`
		});
	}
};