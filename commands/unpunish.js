const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "sunpunish",
		description: "Manually remove punishment from a user",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to unpunish",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		const punishHandler = require("../handlers/punishHandler");
		const userToUnpunish = interaction.options.getUser("user", true);
		const punishRole = (await interaction.guild.roles.fetch()).filter((role) => role.name === "Punished");
		const commandUser = interaction.member.user;
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.reply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {		//check bot permissions
			await interaction.reply(`${interaction.guild.me.user.username} does not have permissions to manage roles in this server.`);
			return;
		}
		
		if(!punishRole) {
			await interaction.reply(`"Punished" role does not exist in this server.`);
			return;
		}
		
		let guildMemberToUnpunish;
		
		try {
			guildMemberToUnpunish = await interaction.guild.members.fetch(userToUnpunish);
		} catch(err) {
			await interaction.reply(`<@${userToUnpunish.id}> (${userToUnpunish.id}) is not a member of this server.`);
			return;
		}
		
		let isSuccess = await punishHandler.removeCustomPunishment({
			guildId: interaction.guild.id,
			userId: userToUnpunish.id
		});
		/*
		await punishHandler.removePunishment({
			guildId: interaction.guild.id,
			userId: userToUnpunish.id
		});
		*/
		if(isSuccess) {
			await interaction.reply(`**Removed punish for user:** <@${userToUnpunish.id}> (${userToUnpunish.id})`);
		} else {
			await interaction.reply(`**Could not remove punish for user:** <@${userToUnpunish.id}> (${userToUnpunish.id})`);
		}
	}
};