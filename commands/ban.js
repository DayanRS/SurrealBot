const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "sban6",
		description: "Ban user from the server",
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
		const userToBan = interaction.options.getUser("username", true);
		const banReason = interaction.options.getString("reason", true);
		const commandUser = interaction.member.user;
		
		const banNotes = [];
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) return;	//check commandUser permissions
		
		if(!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {		//check bot permissions
			await interaction.reply(`${interaction.guild.me.user.username} does not have permissions to ban in this server.`);
			return;
		}
		
		if(!interaction.guild.members.resolve(userToBan)) {	//check if userToBan is a member of the guild
			banNotes.push("User not in guild prior to ban");
		} else if(interaction.guild.members.resolve(userToBan).permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {	//check userToBan permissions
			await interaction.reply("That user cannot be banned.");
			return;
		}
		
		try {
			await userToBan.send(`You have been banned from ${interaction.guild.name}. Reason: ${banReason}`);
		} catch(err) {
			banNotes.push(err.message);
		}
		
		let banString = `
			**Banned user:** <@${userToBan.id}> (${userToBan.id})
			**Reason:** ${banReason}
			**Duration:** Permanent
			**Staff member:** ${commandUser.username}
		`.replaceAll("\t","");
		
		for(let i = 0; i < banNotes.length; i++) {
			banString += `\n**Note**: ${banNotes[i]}`;
		}
		
		await interaction.guild.bans.create(userToBan,
			{
				reason: banReason
			})
			.then(async (banInfo) => {
				await interaction.reply(banString);
			})
			.catch(async (err) => {
				await interaction.reply(`Error: ${err.message}`);
			});
	}
};