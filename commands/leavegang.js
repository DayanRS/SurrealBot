const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "leavegang",
		description: "Remove gang from your nickname"
	},
	async execute(interaction) {
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
			await commandUser.setNickname(commandUser.user.username);
			
			await interaction.reply("Successfully left gang");
		} catch(err) {
			await interaction.reply({
				content: `Error setting name: ${err.message}`,
				ephemeral: true
			});
		}
	}
};