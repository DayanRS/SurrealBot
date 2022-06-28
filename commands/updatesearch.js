const { Constants, Permissions } = require("discord.js");

const punishTypeMap = {
	"mute" : "Punishment",
	"strike" : "Warning",
	"ban" : "Ban"
};

module.exports = {
	data: {
		name: "updatesearch",
		description: "Sync Auttaja punishments",
		options: [
			{
				name: "message",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The Auttaja message ID to check",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const auttajaMessage = interaction.options.getString("message", true);
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {	//check commandUser permissions
			await interaction.editReply({
				content: "You have insufficient permissions for this command.",
				ephemeral: true
			});
			return;
		}
		
		let msg;
		
		try {
			msg = await interaction.channel.messages.fetch(auttajaMessage);
		} catch(err) {
			await interaction.editReply({
				content: "Error fetching message: " + err.message,
				ephemeral: true
			});
			return;
		}
		
		if(!msg.author.id == "242730576195354624") {	//Auttaja bot ID
			await interaction.editReply({
				content: "Invalid message format",
				ephemeral: true
			});
			return;
		}
		
		if(!msg.embeds || msg.embeds[0].fields.length <= 0) {
			await interaction.editReply({
				content: "Invalid message format",
				ephemeral: true
			});
			return;
		}
		
		let searchResults = msg.embeds[0].fields;
		
		let updatedWarnings = [];
		
		let embedDesc = msg.embeds[0].description;
		let userId = embedDesc.substring(embedDesc.indexOf("<@")+2, embedDesc.indexOf(">"));
		
		for(let i = 0; i < searchResults.length-1; i++) {
			let punishType = searchResults[i].value.split("*")[2];
			let punishTime = new Date(searchResults[i].value.split("Made at ")[1] + " UTC");
			let punishReason = searchResults[i].value.split("** - ")[1].split("\nMade at ")[0];
			
			updatedWarnings[i] = {
				time: punishTime,
				reason: punishReason,
				staff: "Auttaja",
				type: punishTypeMap[punishType]
			}
			
			if(punishTypeMap[punishType] == "Punishment") {
				updatedWarnings[i].status = "Expired";
				updatedWarnings[i].roles = [];
			}
		}
		
		const db = require("../services/db");
		const result = await db.findOneAndUpdate(db.WARNINGS, {
			guildId: interaction.guild.id,
			userId: userId,
			warnings: updatedWarnings
		});
		
		if(!result) {
			await interaction.editReply("Error updating warns/punishes");
		}
		
		await interaction.editReply("Updated warns/punishes");
	}
};
