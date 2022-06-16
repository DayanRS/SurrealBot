const { Constants, MessageEmbed } = require("discord.js");

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
		
		const embedMessage = new MessageEmbed()
			.setColor("#ff9b00")
			.setAuthor({
				name: commandUser.user.username,
				iconURL: commandUser.displayAvatarURL()
			})
			.setDescription("Avatar of " + targetUser.displayName + ":")
			.setImage(targetUser.displayAvatarURL({size: 4096, dynamic: true}));
		
		await interaction.reply({ embeds: [embedMessage] });
	}
};