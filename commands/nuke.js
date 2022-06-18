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
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const nukeTarget = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		
		if(!nukeTarget || nukeTarget.username == commandUser.user.username) {
			await interaction.editReply({
				content: `${commandUser} RIP you nuked yourself, rough day buddy`
			});
			return;
		}
		
		await interaction.editReply({
			content: `☢️ **WARNING** ☢️ <@${nukeTarget.id}> 💣 you 💣 have 💣 been 💣 nuked 💣 by 💣 <@${commandUser.user.id}> ☢️ **WARNING** ☢️`
		});
	}
};