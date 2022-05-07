const { Client, Intents } = require("discord.js");
const ENV_VARS = require("dotenv").config();	//load .env into process.env
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
	console.log("Hi");
});

client.login(DISCORD_TOKEN);
