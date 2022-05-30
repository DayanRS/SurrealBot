const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "joingang",
		description: "Set a gang in your nickname",
		options: [
			{
				name: "gang",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The name of the gang",
				required: true
			}
		]
	},
	async execute(interaction) {
		const gangToJoin = interaction.options.getString("gang", true);
		const commandUser = interaction.member;	//as GuildMember
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) {	//check commandUser permissions
			await interaction.reply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {		//check bot permissions
			await interaction.reply(`${interaction.guild.me.user.username} does not have permissions to manage roles in this server.`);
			return;
		}
		
		try {
			await commandUser.setNickname(`${commandUser.displayName} 「${gangToJoin}」`);
			
			await interaction.reply(`Joined ${gangToJoin}`);
		} catch(err) {
			await interaction.reply({
				content: `Error setting name: ${err.message}`,
				ephemeral: true
			});
		}
	}
};