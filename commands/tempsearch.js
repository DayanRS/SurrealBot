const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "tempsearch",
		description: "Search for punishments, ignore guild",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user for which to check punishments",
				required: true
			},
			{
				name: "showid",
				type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
				description: "Show ID of results",
				required: false
			}
		]
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;
		
		const userToSearch = interaction.options.getUser("user", true);
		const commandUser = interaction.member.user;
		
		const showId = interaction.options.getBoolean("showid", false) || false;
		console.log("showId: " + showId);
		const searchNotes = [];
		
		const db = require("../services/db");
		
		/*
		const resultsArr = await db.tempSearch({
			userId: userToSearch.id
		});
		*/
		
		const resultsArr = await db.appendField();
		
		console.log(resultsArr);
		return;
		if(resultsArr.length > 1) searchNotes.push("Duplicate database entries (Should not happen)");
		
		if(resultsArr.length === 0) {
			await interaction.editReply(`<@${userToSearch.id}> (${userToSearch.id}) has a clean slate.`);
			return;
		}
		
		const results = resultsArr[0];
		
		console.log(results);
		
		let searchString = `**TEMP Search results for** <@${userToSearch.id}> (${userToSearch.id}):\n\n`;
		
		if(results.warnings) {
			for(let i = 0; i < results.warnings.length; i++) {
				let infracType = results.warnings[i].type;
				if(results.warnings[i].status) infracType += ` (${results.warnings[i].status})`;
				
				switch (infracType) {
					case "Warning":
						infracType = "⚠️ " + infracType;
						break;
					case "Ban":
						infracType = "🔨 " + infracType;
				
					default: // punishments
						infracType = "🔇 " + infracType;
				}
				
				searchString += `**${infracType}:** ${results.warnings[i].reason} [${formatTimestamp(results.warnings[i].time)}]`;
				
				if(showId) searchString += " (ake8xjdj)";
				
				searchString += "\n";
			}
		}
		
		if(results.punishments) {
			for(let i = 0; i < results.punishments.length; i++) {
				searchString += `**Punishment (Active):** ${results.punishments[i].reason} [${formatTimestamp(results.punishments[i].time)}]\n`;
			}
		}
		
		for(let i = 0; i < searchNotes.length; i++) {
			searchString += `\n**Note**: ${searchNotes[i]}`;
		}
		
		await interaction.editReply(searchString);
	}
};

//Formats as "Fri, 12 May 2022 UTC - 5 day(s) ago"
function formatTimestamp(timestamp) {
	const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const date = new Date(timestamp);
	
	let str = "";
	
	str += dayNames[date.getUTCDay()] + ", ";
	str += date.getUTCDate() + " ";
	str += monthNames[date.getUTCMonth()] + " ";
	str += date.getUTCFullYear();
	str += " UTC";
	str += ` - ${getTimeDiffStr(timestamp)}`;
	
	return str;
}

function getTimeDiffStr(timestamp) {
	const diffDays = Math.floor((Date.now() - timestamp)/(1000*60*60*24));
	return `${diffDays} day(s) ago`;
}