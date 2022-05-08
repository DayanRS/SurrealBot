const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { DEV_GUILD_ID, BOT_ID, DISCORD_TOKEN } = require("dotenv").config().parsed;

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));	//array of js file names

for(const fileName of commandFiles) {
	const command = require(`./commands/${fileName}`);	//import command module
	commands.push(command.data);
}

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

(async () => {
	try {
		console.log("Updating commands...");
		
		await rest.put(Routes.applicationGuildCommands(BOT_ID, DEV_GUILD_ID), { body: commands });	//deploy to dev server
		
		//await rest.put(Routes.applicationCommands(BOT_ID), { body: commands });	//global commands
		
		console.log("Successfully updated commands!");
	} catch(err) {
		console.error(err);
	}
})();


