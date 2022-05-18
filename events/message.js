require("dotenv").config();
const client = require("../index");
//test
module.exports = {
	name: "messageCreate",			//event name
	
	async execute(msg) {
		if(msg.author.bot) return;	//prevent replying to self
		if(msg.channel.type != "dm") return;
		
		const guild = await client.guilds.fetch(process.env.DEV_GUILD_ID);
		
		msg.reply("Test reply");
		
		/*
		Process:
		-DM reply: "Thank you for your message! Our mod team will reply to you here as soon as possible"
		-bot opens text channel by discord name, ie "user-1234"
		-ticket channel: "@ModMail Alert New modmail thread (Dayan#6038)"
		-ticket channel: "ACCOUNT AGE 6 years, 5 months, ID 128498597548261376 (@Dayan)
			NICKNAME 🐝Can of bees🐝, JOINED 4 years, 3 months ago, ROLES Being, Admin, 0-dimensional, 2-dimensional, 1-dimensional
			────────────────"
		-ticket channel: "⚙️ Surreal ModMail: Thank you for your message! Our mod team will reply to you here as soon as possible"
		-ticket channel: "!r message" deletes the mod's message and bot sends message in its place "`#` **(Role) Name:** message", eg: "`1` **(Moderator) Jeff:** hello"
		-ticket channel: DMs to bot get relayed: "**User#1234:** message"
		-ticket channel: "!close [time]" results in bot message "Thread is now scheduled to be closed in [time]. Use `!close cancel` to cancel.", where time is of the form "5 minutes"
		-DM reply: "Thread has been closed. If you reply, a new thread will be generated"
		*/
	}
};