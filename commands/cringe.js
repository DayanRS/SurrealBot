const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "cringe",
		description: "Add or remove someone's Cringe role",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The name of the Cringe target",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const cringeTarget = interaction.options.getUser("user");
		const cringeRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Cringe")).at(0);
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {		//check bot permissions
			await interaction.editReply(`${interaction.guild.me.user.username} does not have permissions to manage roles in this server.`);
			return;
		}
		
		if(!cringeRole) {
			await interaction.editReply(`"Cringe" role does not exist in this server.`);
			return;
		}
		
		let guildMemberToCringe;
		
		try {
			guildMemberToCringe = await interaction.guild.members.fetch(cringeTarget);
		} catch(err) {
			await interaction.editReply(`<@${cringeTarget.id}> (${cringeTarget.id}) is not a member of this server.`);
			return;
		}
		
		if(guildMemberToCringe.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check userToCringe permissions
			await interaction.editReply("That user cannot be punished.");
			return;
		}
		
		if(guildMemberToCringe.roles.cache.some(role => role.id === cringeRole.id)) {
			await interaction.guild.members.resolve(cringeTarget).roles.remove(cringeRole);
			await interaction.editReply(`<@${guildMemberToCringe.id}> (${guildMemberToCringe.id}) has gotten their Cringe role removed.`);
			
		} else {
			await interaction.guild.members.resolve(cringeTarget).roles.add(cringeRole);
			await interaction.editReply(`<@${guildMemberToCringe.id}> (${guildMemberToCringe.id}) has received the Cringe role.`);
		}
	}
};