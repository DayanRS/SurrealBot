const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "kiss",
		description: "Kiss someone!",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user who you want to kiss",
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const kissTarget = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		
		if(!kissTarget || kissTarget.username == commandUser.user.username) {
			await interaction.editReply({
				content: `${commandUser} somehow managed to kiss themself.`
			});
			return;
		}
		
		await interaction.editReply({
			content: `<@${kissTarget.id}> you have been kissed by <@${commandUser.user.id}> 💋`
		});
	}
};