module.exports = {
	data: {
		name: "events",
		description: "Toggle events ping role to be notified of upcoming events",
	},
	
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		interaction.isDeferred = true;
		
		const commandUser = interaction.member;	//as GuildMember
		const eventsRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Events Ping")).at(0);
		
		if(!eventsRole) {
			await interaction.editReply(`"Events Ping" role does not exist in this server.`);
			return;
		}
		
		let hasEventsRole = commandUser.roles.cache.some(role => role.id === eventsRole.id);
		
		if(hasEventsRole) {
			await interaction.guild.members.resolve(commandUser).roles.remove(eventsRole);
		} else {
			await interaction.guild.members.resolve(commandUser).roles.add(eventsRole);
		}
		
		let msg = !hasEventsRole ? "now" : "no longer";
		
		await interaction.editReply({
			content: `You will ${msg} be notified of upcoming events`,
			ephemeral: true
		});
	}
};