const { Constants, Permissions } = require("discord.js");

module.exports = {
	data: {
		name: "ssearch",
		description: "Search for punishments",
		options: [
			{
				name: "user",
				type: Constants.ApplicationCommandOptionTypes.USER,
				description: "The user for which to check punishments",
				required: true
			}
		]
	},
	
	async execute(interaction) {
		const userToSearch = interaction.options.getUser("user", true);
		
		const searchNotes = [];
		
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return;	//check commandUser permissions
		
		let guildMemberToSearch;
		
		try {
			guildMemberToSearch = await interaction.guild.members.fetch(userToSearch);
		} catch(err) {
			await interaction.reply(`<@${userToSearch.id}> (${userToSearch.id}) is not a member of this server.`);
			return;
		}
		
		const db = require("../services/db");
		const resultsArr = await db.testSearch({
			guildId: interaction.guild.id,
			userId: userToSearch.id
		});
		
		if(resultsArr.length > 1) searchNotes.push("Duplicate database entries (Should not happen)");
		
		const results = resultsArr[0];
		
		let searchString = "";
		
		if(results.warnings) {
			for(let i = 0; i < results.warnings.length; i++) {
				searchString += `**Warning:** ${results.warnings[i].reason} [${formatTimestamp(results.warnings[i].time)}]\n`;
			}
		}
		
		if(results.punishments) {
			for(let i = 0; i < results.punishments.length; i++) {
				searchString += `**Punishment:** ${results.punishments[i].reason} [${formatTimestamp(results.punishments[i].time)}]\n`;
			}
		}
		
		for(let i = 0; i < searchNotes.length; i++) {
			searchString += `\n**Note**: ${searchNotes[i]}`;
		}
		
		await interaction.reply(searchString);
	}
};

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
	
	return str;
}