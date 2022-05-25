const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "guildMemberAdd",	//user joins the server
	
	async execute(newMember) {
		const welcomeChannel = await newMember.guild.channels.fetch("546342028162891776");	//TODO: make channel ID not hardcoded
		
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