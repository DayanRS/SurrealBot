const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "eventping",
		description: "Do an event ping.",
		options: [
			{
				name: "pingEvents",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "Short description of the event being hosted.",
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;

		const commandUser = interaction.member.user;
		
		let eventDesc = interaction.options.getString("eventDescription");
		const eventHostRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Event Host")).at(0);
		const eventsPingRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Events Ping")).at(0);
		
		if(!eventsPingRole) {
			await interaction.editReply(`"Events Ping" role does not exist in this server.`);
			return;
		}

		if(!commandUser.roles.cache.some(role => role.id === eventHostRole.id)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}

		await interaction.editReply({
			content: `<@${eventDesc} <@${eventsPingRole.id}>`
		});
		
	}
};