const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "pingeventrole",
		description: "Do an event ping.",
		options: [
			{
				name: "eventdescription",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "Short description of the event being hosted.",
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const commandUser = interaction.member;
		
		let eventDesc = interaction.options.getString("eventDescription");
		const eventHostRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Event Host")).at(0);
		const eventsPingRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Events Ping")).at(0);
		
		if(!eventsPingRole) {
			await interaction.editReply(`"Events Ping" role does not exist in this server.`);
			return;
		}
		
		let isStaff = interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES);	//check commandUser permissions
		let hasEventRole = !!eventHostRole ? commandUser.roles.cache.some(role => role.id === eventHostRole.id) : false;	//if role exists, check if user has it
		
		if(!isStaff && !hasEventRole) {
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