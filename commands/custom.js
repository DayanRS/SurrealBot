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
				name: "link",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The link containing content you want shown when executing the command",
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
        const commandName = interaction.options.getString("name");
        const commandLink = interaction.options.getString("link");
        let commandDesc = interaction.options.getString("description");
		if(!commandDesc) {
			commandDesc = "There is no description for this command";
		}
		const commandUser = interaction.member;	//as GuildMember

        if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.reply({
                content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
        
		if(!isValidHttpUrl(commandLink)) {
			await interaction.reply({
                content: "The argument provided is not a link.",
			});
			return;
		}

		const db = require("../services/db");
		await db.insert(db.COMMANDS, {
			commandName: commandName,
			link: commandLink,
			description: commandDesc,
		});

	}

};
function isValidHttpUrl(string) {
	let url;
	
	try {
	  url = new URL(string);
	} catch (_) {
	  return false;  
	}
  
	return url.protocol === "http:" || url.protocol === "https:";
  }