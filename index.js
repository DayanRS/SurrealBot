const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { DISCORD_TOKEN } = require("dotenv").config().parsed;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));	//array of js file names

for(const fileName of commandFiles) {
	const command = require(`./commands/${fileName}`);	//import module
	client.commands.set(command.data.name, command);	//set key/value pair in collection
}

client.once("ready", () => {
	console.log("Hi");
});


client.on("interactionCreate", async (interaction) => {
	if(!interaction.isCommand()) return;
	
	const command = client.commands.get(interaction.commandName);
	
	if(!command) return;
	
	try {
		await command.execute(interaction);
	} catch(err) {
		console.error(err);
		
		await interaction.reply({
			content: "Error executing command",
			ephemeral: true		//only the user can see this reply
		});
	}
});


client.login(DISCORD_TOKEN);
