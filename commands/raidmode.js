const { Constants, Permissions } = require("discord.js");
const settings = require("../client-settings.js");

module.exports = {
	data: {
		name: "raidmode",
		description: "Temporarily punish user",
		options: [
			{
				name: "raidstatus",
				type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
				description: "Set raid mode: true = ON, false = OFF",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const isRaidMode = interaction.options.getBoolean("raidstatus");
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		let alreadyStr = "";
		let raidModeStatus = isRaidMode ? "ON" : "OFF";
		
		if(settings.raidMode == isRaidMode) alreadyStr = `(already ${raidModeStatus.toLowerCase()})`;
		settings.raidMode = isRaidMode;
		
		await interaction.editReply(`Raid mode set to **${raidModeStatus}**  ${alreadyStr}`);
	}
};
