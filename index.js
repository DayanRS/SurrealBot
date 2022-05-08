const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { DISCORD_TOKEN } = require("dotenv").config().parsed;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//initialise commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));	//array of js file names

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

//initialise database - TODO: Move to punish handler
const punishDB = require("./services/db");
(async () => {
	await punishDB.connect();
	
	setInterval(async () => {
		let punishes = await punishDB.findAll();
		
		console.log(punishes);
		
		for(let i = 0; i < punishes.length; i++) {
			let timeDiff = (Date.now() - punishes[i].time)/1000;	//in seconds
			
			if(timeDiff > punishes[i].duration) {
				console.log(`Punish time up for id: ${punishes[i].userId}`);
				//unpunish
			}
		}
	}, 10000);
})();

client.login(DISCORD_TOKEN);
