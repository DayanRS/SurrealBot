const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "custom",
		description: "Adds a custom command",
		options: [
			{
				name: "name",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The name of the command",
				required: true
			},
			{
				name: "content",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The content you want shown when executing the command",
				required: true
			},
			{
				name: "description",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The description for the command",
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const commandName = interaction.options.getString("name");
		let commandContent = interaction.options.getString("content");
		let commandDesc = interaction.options.getString("description");
		
		if(!commandDesc) {
			commandDesc = "There is no description for this command";
		}
		
		const commandUser = interaction.member;	//as GuildMember
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			
			return;
		}

		commandContent = commandContent.replace(/(@everyone|@here)/gmi, "hehe");	//makes it unabusable
		
		const customCommandHandler = require("../handlers/customCommandHandler");
		await customCommandHandler.addCommand({
			guildId: interaction.guildId,
			commandName: commandName,
			commandContent: commandContent,
			commandDescription: commandDesc
		});
		
		await interaction.editReply(`Created command: ${commandName}`);
	}
};