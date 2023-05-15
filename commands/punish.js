const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "spunish",
		description: "Temporarily punish user",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user to punish",
				required: true
			},
			{
				name: "duration",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The punishment duration",
				required: true
			},
			{
				name: "reason",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The reason for punishing them",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const userToPunish = interaction.options.getUser("user", true);
		const punishDuration = interaction.options.getString("duration", true);
		const punishReason = interaction.options.getString("reason", true);
		const commandUser = interaction.member.user;
		
		const punishRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Punished")).at(0);
		const boosterRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Nitro Booster")).at(0);
		
		const punishNotes = [];
		
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
		
		if(!punishRole) {
			await interaction.editReply(`"Punished" role does not exist in this server.`);
			return;
		}
		
		let guildMemberToPunish;
		
		try {
			guildMemberToPunish = await interaction.guild.members.fetch(userToPunish);
		} catch(err) {
			await interaction.editReply(`<@${userToPunish.id}> (${userToPunish.id}) is not a member of this server.`);
			return;
		}
		
		if(guildMemberToPunish.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check userToPunish permissions
			await interaction.editReply("That user cannot be punished.");
			return;
		}
		
		if(guildMemberToPunish.roles.cache.some(role => role.id === punishRole.id)) {
			await interaction.editReply(`<@${userToPunish.id}> (${userToPunish.id}) is already punished. Use \`/ssearch\` to review punishment, \`/sunpunish\` before punishing again, or \`/sban\` if applicable.`);
			return;
		}
		
		//validate time string and convert to seconds
		const isValidTime = /^[0-9]+[smhdw]$/g.test(punishDuration);
		if(!isValidTime) {
			await interaction.editReply("Invalid time string: " + punishDuration);
			return;
		}
		
		let splitTime = punishDuration.match(/^[0-9]+|[smhdw]$/g);	//arr in the form ["10", "d"]
		splitTime[0] = Number(splitTime[0]);
		
		switch(splitTime[1]) {	//convert to seconds
			case "s":
				break;
				
			case "m":
				splitTime[0] *= 60;
				break;
				
			case "h":
				splitTime[0] *= 3600;	//60*60;
				break;
				
			case "d":
				splitTime[0] *= 86400;	//60*60*24;
				break;
				
			case "w":
				splitTime[0] *= 604800;	//60*60*24*7;
				break;
				
			default:
				await interaction.editReply("Error parsing time string: " + punishDuration);
				return;
		}
		
		splitTime[1] = "s";
		
		try {
			await userToPunish.send(`You have been punished in **${interaction.guild.name}** for ${punishDuration}. Reason: ${punishReason}`);
		} catch(err) {
			punishNotes.push(err.message);
		}
		
		let roles = interaction.guild.members.resolve(userToPunish).roles.cache.filter(role => role.name != "@everyone").map(role => role.id);	//array of role ids
		

		let punishedRoles = [punishRole];
		let punishTarget = await interaction.guild.members.fetch(userToPunish);
		// check if user has the booster role
		if (punishTarget.roles.cache.some(role => role.id === boosterRole.id)) {
			punishedRoles.push(boosterRole);
		}

		//apply punishment
		await interaction.guild.members.resolve(userToPunish).roles.set(punishedRoles);
		
		//Process:
		//-check permissions
		//-validation checks
		//-message user if possible
		//-apply punishment
		//-store details in db
		//-message in log channel
		
		//TODO: handle multiple punishments
		const db = require("../services/db");
		await db.insert(db.PUNISHES, {
			guildId: interaction.guild.id,
			userId: userToPunish.id,
			reason: punishReason,
			staff: interaction.member.user.id,
			time: Date.now(),
			duration: splitTime[0],
			roles: roles,
			refId : "p_" + Math.floor(Math.random()*1000000000000).toString(36)
		});
		
		let punishString = `
			**Punished user:** <@${userToPunish.id}> (${userToPunish.id})
			**Reason:** ${punishReason}
			**Duration:** ${punishDuration} (${splitTime[0]+splitTime[1]})
			**Staff member:** ${interaction.member.user.username}
		`.replaceAll("\t","");
		
		for(let i = 0; i < punishNotes.length; i++) {
			punishString += `\n**Note**: ${punishNotes[i]}`;
		}
		
		await interaction.editReply(punishString);
	}
};
