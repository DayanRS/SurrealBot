const { Permissions, Constants } = require("discord.js");

module.exports = {
	data: {
		name: "sunban",
		description: "Unban user from the server",
		options: [
			{
				name: "username",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to unban",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const userToUnban = interaction.options.getUser("username", true);
		const commandUser = interaction.member.user;
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {		//check bot permissions
			await interaction.editReply(`${interaction.guild.me.user.username} does not have permissions to unban in this server.`);
			return;
		}
		
		await interaction.guild.bans.remove(userToUnban)
		.then(async () => {
			await interaction.editReply(`**Unbanned user:** <@${userToUnban.id}> (${userToUnban.id})`);
		})
		.catch(async (err) => {
			await interaction.editReply(`**Error:** ${err.message}`);
		});
	}
};