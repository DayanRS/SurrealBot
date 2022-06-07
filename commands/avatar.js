const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "avatar",
		description: "Get the avatar of person yourself or user mentioned",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The name of the user",
			},
            {
				name: "default",
				type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
				description: "Display the user avatar instead of the server specific avatar?",
			}
		]
	},
	async execute(interaction) {
		let targetUser = interaction.options.getUser("user");
        const defaultAvatar = interaction.options.getBoolean("default");
		const commandUser = interaction.member;	//as GuildMember
		
        if(!targetUser) {
            targetUser = commandUser;
        } else {
            try {
				targetUser = await interaction.guild.members.fetch(targetUser);
			} catch(err) {
				await interaction.reply({
					content: `<@${targetUser.id}> (${targetUser.id}) is not a member of this server.`,
					ephemeral: true
				});
				return;
			}
        }

        await interaction.reply({
            content: `${
                defaultAvatar
                ?
                targetUser.user.displayAvatarURL({size: 4096, dynamic: true})
                :
                targetUser.displayAvatarURL({size: 4096, dynamic: true})
            }`
        });
	}
};