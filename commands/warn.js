const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "swarn",
		description: "Issue a warning to someone",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to warn",
				required: true
			},
			{
				name: "reason",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The reason for warning them",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const userToWarn = interaction.options.getUser("user", true);
		const warnReason = interaction.options.getString("reason", true);
		const commandUser = interaction.member.user;
		
		const warnNotes = [];
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		let guildMemberToWarn;
		
		try {
			guildMemberToWarn = await interaction.guild.members.fetch(userToWarn);
		} catch(err) {
			await interaction.editReply(`<@${userToWarn.id}> (${userToWarn.id}) is not a member of this server.`);
			return;
		}
		
		try {
			await userToWarn.send(`You have been issued a warning in **${interaction.guild.name}** for: ${warnReason}`);
		} catch(err) {
			warnNotes.push(err.message);
		}
		
		const db = require("../services/db");
		const result = await db.findOneAndUpdate(db.WARNINGS, {
			guildId: interaction.guild.id,
			userId: userToWarn.id,
			warnings: [
				{
					time: Date.now(),
					reason: warnReason,
					staff: interaction.member.user.id,
					type: "Warning"
				}
			]
		});
		
		if(result.warnings.length >= 3) warnNotes.push("User has 3 or more warnings/punishments");
		
		let warnString = `
			**Warned user:** <@${userToWarn.id}> (${userToWarn.id})
			**Reason:** ${warnReason}
			**Staff member:** ${interaction.member.user.username}
		`.replaceAll("\t","");
		
		for(let i = 0; i < warnNotes.length; i++) {
			warnString += `\n**Note**: ${warnNotes[i]}`;
		}
		
		await interaction.editReply(warnString);
	}
};
