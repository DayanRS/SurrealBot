const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "rmcustom",
		description: "Removes a custom command",
		options: [
			{
				name: "name",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The name of the command",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		const commandName = interaction.options.getString("name");
		
		const commandUser = interaction.member;	//as GuildMember
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.reply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			
			return;
		}
		
		const customCommandHandler = require("../handlers/customCommandHandler");
		let deleteSuccess = await customCommandHandler.removeCommand({
			guildId: interaction.guildId,
			commandName: commandName
		});
		
		if(deleteSuccess) {
			await interaction.reply(`Removed command: ${commandName}`);
		} else {
			await interaction.reply(`Error removing command: ${commandName}`);
		}
	}
};