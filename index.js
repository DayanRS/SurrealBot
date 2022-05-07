const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { DISCORD_TOKEN } = require("dotenv").config().parsed;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//initialise commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));	//array of js file names

for(const fileName of commandFiles) {
	const command = require(`./commands/${fileName}`);	//import module
	client.commands.set(command.data.name, command);	//set key/value pair in collection
}

//initialise event handlers
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

for(const fileName of eventFiles) {
	const event = require(`./events/${fileName}`);
	
	if(event.once) {
		client.once(event.name, (...args) => event.execute(...args));	//pass arguments back to command
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(DISCORD_TOKEN);
