const { Constants, MessageEmbed } = require("discord.js");

module.exports = {
	data: {
		name: "whois",
		description: "Get information about a user",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The name of the user",
			}
		]
	},
	
	async execute(interaction) {
		let targetUser = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		
		if(!targetUser) {
			targetUser = commandUser;
			
		} else {
			try {
				targetUser = await interaction.guild.members.fetch(targetUser);
			} catch(err) {
				await interaction.reply({
					content: `<@${targetUser.id}> (${targetUser.id}) is not a member of this server.`,
					ephemeral: true
				});
				
				return;
			}
		}
		
		const joinDate = targetUser.joinedAt;
		const timeSinceJoin = Math.floor((Date.now() - targetUser.joinedAt) / (1000 * 60 * 60 * 24));	//in days
		const daysAgoMsg = timeSinceJoin == 1 ? " day ago" : " days ago";
		const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		const roleString = targetUser.roles.cache.filter(r => r.name != "@everyone").map(r => `${r}`).join(" ");
		
		const embedMessage = new MessageEmbed()
			.setColor("#ff9b00")
			.setAuthor({
				name: commandUser.user.username,
				iconURL: commandUser.displayAvatarURL()
			})
			.addField("**Username:**", targetUser.user.username)
			.addField("**Roles:**", roleString ? roleString : "None, yet!")
			.addField("**Joined at:**",
				`
				${joinDate.toLocaleDateString(undefined, dateOptions)}
				${timeSinceJoin + daysAgoMsg}
				`
			)
			.addField("**Registered at:**", targetUser.user.createdAt.toLocaleDateString(undefined, dateOptions))
			.setTimestamp()
			.setThumbnail(targetUser.user.displayAvatarURL({ dynamic: true }));	//dynamic for animated avatars
		
		await interaction.reply({ embeds: [embedMessage] });
	}
};