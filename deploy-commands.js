const fs = require('node:fs');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { DEV_GUILD_ID, BOT_ID, DISCORD_TOKEN } = require("dotenv").config().parsed;

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));	//array of js file names

for(const fileName of commandFiles) {
	const command = require(`./commands/${fileName}`);	//import module
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(BOT_ID, DEV_GUILD_ID), { body: commands })
	.then(() => console.log("Successfully loaded commands."))
	.catch(console.error);

