const { MessageEmbed } = require("discord.js");
const client = require("../index");

module.exports = {
	name: "guildMemberAdd",	//user joins the server
	
	async execute(newMember) {
		let memberPunishObj = await require("../handlers/punishHandler").checkPunishments({	//reapply punishment if necessary
			userId: newMember.id,
			guildId: newMember.guild.id
		});
		
		const welcomeChannel = newMember.guild.channels.cache.filter(channel => channel.name === "general").at(0);
		
		if(memberPunishObj) {
			let count = 0;
			let repunish = async () => {	//reapply punish role to prevent bots (mee6) overriding it
				if(count++ > 7) return;
				
				const punishRole = ((await newMember.guild.roles.fetch()).filter((role) => role.name === "Punished")).at(0);
				await newMember.roles.set([punishRole]);	//give them the role again!
				
				repunish();
			}
			
			repunish();
			
			return;
		}
		
		if(!welcomeChannel || client.debugMode) return;
		
		const embedMessage = new MessageEmbed()
			.setColor("#ff9b00")
			.setTitle("Welcome new member!")
			.setDescription(`<@${newMember.id}> ${newMember.user.tag}`)
			.addField("**You should:**",
				`- Read the rules
				- Ask any questions you have
				- Say hi ${newMember.guild.emojis.cache.get("530151376274194432")}
				`.replaceAll("\t",""))
			.setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }));	//dynamic for animated avatars
			
		const result = await welcomeChannel.send({ embeds: [embedMessage] });
		
		await result.react("👋");
	}
};