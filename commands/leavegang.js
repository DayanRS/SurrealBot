const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "leavegang",
		description: "Remove gang from your nickname"
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const commandUser = interaction.member;	//as GuildMember
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			
			return;
		}
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {		//check bot permissions
			await interaction.editReply(`${interaction.guild.me.user.username} does not have permissions to manage roles in this server.`);
			return;
		}
		
		try {
			let preDisplayName = commandUser.displayName;
			let ganglessName = preDisplayName.replace(/「.*」/, ""); //remove gang sign, but keep server nick, if applicable
			
			if(preDisplayName == ganglessName) { throw Error("Not currently in a gang"); }
			
			await commandUser.setNickname(ganglessName);
			await interaction.editReply("Successfully left gang");
			
		} catch(err) {
			await interaction.editReply({
				content: `Error setting name: ${err.message}`,
				ephemeral: true
			});
		}
	}
};
