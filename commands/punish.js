const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "spunish4",
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
		const userToPunish = interaction.options.getUser("user", true);
		const punishDuration = interaction.options.getString("duration", true);
		const punishReason = interaction.options.getString("reason", true);
		
		const punishRole = interaction.guild.roles.cache.find(role => role.name === "Punished");
		
		const punishNotes = [];
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return;	//check commandUser permissions
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {		//check bot permissions
			await interaction.reply(`${interaction.guild.me.user.username} does not have permissions to manage roles in this server.`);
			return;
		}
		
		if(!punishRole) {
			await interaction.reply(`"Punished" role does not exist in this server.`);
			return;
		}
		
		if(!interaction.guild.members.resolve(userToPunish)) {	//check if userToPunish is a member of the guild - TODO: Test
			await interaction.reply(`${interaction.guild.me.user.username} is not a member of this server.`);
		} else if(interaction.guild.members.resolve(userToPunish).permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {	//check userToPunish permissions
			await interaction.reply("That user cannot be punished.");
			return;
		}
		
		//validate time string and convert to seconds
		const isValidTime = /^[0-9]+[smhdw]$/g.test(punishDuration);
		if(!isValidTime) {
			await interaction.reply("Invalid time string: " + punishDuration);
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
				await interaction.reply("Error parsing time string: " + punishDuration);
				return;
		}
		
		splitTime[1] = "s";
		
		try {
			await userToPunish.send(`You have been punished in ${interaction.guild.name} for ${punishDuration}. Reason: ${punishReason}`);
		} catch(err) {
			punishNotes.push(err.message);
		}
		
		//apply punishment
		await interaction.guild.members.resolve(userToPunish).roles.add(punishRole);
		
		//Process:
		//-check permissions
		//-validation checks
		//-message user if possible
		//-apply punishment
		//-message in log channel
		//-store details in db
		
		let punishString = `
			**Punished user:** <@${userToPunish.id}> (${userToPunish.id})
			**Reason:** ${punishReason}
			**Duration:** ${punishDuration} (${splitTime[0]+splitTime[1]})
			**Staff member:** ${interaction.member.user.username}
		`.replaceAll("\t","");
		
		for(let i = 0; i < punishNotes.length; i++) {
			punishString += `\n**Note**: ${punishNotes[i]}`;
		}
		
		await interaction.reply(punishString);
	}
};
