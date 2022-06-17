const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "guildMemberAdd",	//user joins the server
	
	async execute(newMember) {
		const welcomeChannel = newMember.guild.channels.cache.filter(channel => channel.name === "general").at(0);
		
		if(!welcomeChannel) return;
		
		const embedMessage = new MessageEmbed()
			.setColor("#ff9b00")
			.setTitle("Welcome new member!")
			.setDescription(`<@${newMember.id}> ${newMember.user.tag}`)
			.addField("**You should:**",
				`- Read the rules
				- Ask any questions you have
				- Say hi :chicken:
				`.replaceAll("\t",""))
			.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }));	//dynamic for animated avatars
			
		const result = await welcomeChannel.send({ embeds: [embedMessage] });
		
		await result.react("👋");
		
		require("../handlers/punishHandler").checkPunishments();	//reapply punishment if necessary
	}
};