const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { DISCORD_TOKEN } = require("dotenv").config().parsed;

const client = new Client({
	partials: ["MESSAGE", "MESSAGE_CREATE", "CHANNEL"],
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
});

module.exports = client;	//surely there's a nicer way to do this

client.debugMode = false;
client.getTimeString = () => {
	const date = new Date();
	const h = date.getUTCHours();
	const m = date.getUTCMinutes();
	const s = date.getUTCSeconds();
	
	return `[${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}.${s < 10 ? "0" + s : s}] `;
};

client._log = console.log;
console.log = (...args) => {
	process.stdout.write(client.getTimeString());
	client._log(...args);
}

//initialise commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));	//array of js file names
client.customCommands = {};

for(const fileName of commandFiles) {
	const command = require(`./commands/${fileName}`);	//import command module
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

//initialise database
(async () => {
	//return;	//dev
	await require("./services/db").connect();
	await require("./handlers/customCommandHandler").loadCommands();
	
	setInterval(async () => {
		require("./handlers/punishHandler").checkPunishments();
	}, 60000);
})();

client.login(DISCORD_TOKEN);
