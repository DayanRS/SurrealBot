const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "iq",
		description: "Check the IQ of a user",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user whose IQ you want to know",
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		let iqUser = interaction.options.getUser("user");
		const commandUser = interaction.member;	//as GuildMember
		
		if(!iqUser || iqUser.username == commandUser.user.username) {
			await interaction.editReply({
				content: `${commandUser} has an IQ of 5.`
			});
			return;
			
		} else {
			try {
				iqUser = await interaction.guild.members.fetch(iqUser);
			} catch(err) {
				await interaction.editReply({
					content: `<@${iqUser.id}> (${iqUser.id}) is not a member of this server.`,
					ephemeral: true
				});
				
				return;
			}
		}
		
		let iq = this.getIQ(iqUser.displayName);
		
		await interaction.editReply({
			content: `<@${iqUser.id}> has an IQ of ${iq} out of 180.`
		});
	},
	
	getIQ(seed) {
		let temp = seed.toLocaleLowerCase().split("").reduce((acc, letter) => acc + letter.charCodeAt(0) * 3, 0)
		let iq = temp % 180;
		return iq;
	}
};