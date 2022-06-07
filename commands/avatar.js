const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "avatar",
		description: "Get the avatar of person yourself or user mentioned",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The name of the user",
			}
		]
	},
	async execute(interaction) {
		let targetUser = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		
        if(!targetUser) {
            targetUser = commandUser;
        }


        await interaction.reply({
            content: `${targetUser.displayAvatarURL()}`
        });
	}
};