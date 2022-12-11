const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "jban",
		description: "Ban user from the server (real)",
		options: [
			{
				name: "username",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to ban",
				required: true
			},
			{
				name: "reason",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The reason for banning them",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const userToBan = interaction.options.getUser("username", true);
		const banReason = interaction.options.getString("reason", true);
		const commandUser = interaction.member.user;
		
		const banNotes = [];

		if(!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {		//check bot permissions
			await interaction.editReply(`${interaction.guild.me.user.username} does not have permissions to ban in this server.`);
			return;
		}
		
		if(!interaction.guild.members.resolve(userToBan)) {	//check if userToBan is a member of the guild
			banNotes.push("User not in guild prior to ban");
		} else if(interaction.guild.members.resolve(userToBan).permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {	//check userToBan permissions
			await interaction.editReply("That user cannot be banned.");
			return;
		}
		
		try {
			await userToBan.send(`You have been banned from **${interaction.guild.name}**. Reason: ${banReason}. To request a ban appeal, please use this form: https://docs.google.com/forms/d/12ydM6TRD2V6ytrStjeJCPQdRDU8yarj7zVBSRYcxutQ`);
		} catch(err) {
			banNotes.push(err.message);
		}
	}
};