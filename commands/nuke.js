const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "nuke",
		description: "Nuke someone!",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user who you want to nuke",
			}
		]
	},
	async execute(interaction) {
		let nukeTarget = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		

        if(!nukeTarget || nukeTarget.username == commandUser.user.username) {
            await interaction.reply({
				content: `${commandUser} RIP you nuked yourself, rough day buddy`
			});
			return;
        }


        await interaction.reply({
            content: `☢️ **WARNING** ☢️ <@${nukeTarget.id}> 💣 you 💣 have 💣 been 💣 nuked 💣 by 💣 <@${commandUser.user.id}> ☢️ **WARNING** ☢️`
        });

	},
};