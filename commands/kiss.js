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
		let kissTarget = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		

        if(!kissTarget || kissTarget.username == commandUser.user.username) {
            await interaction.reply({
				content: `${commandUser} somehow managed to kissed themselves.`
			});
			return;
        }


        await interaction.reply({
            content: `<@${kissTarget.id}> has been kissed by <@${commandUser.user.id}> 💋`
        });

	},
};