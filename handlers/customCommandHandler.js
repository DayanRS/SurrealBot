const db = require("../services/db");
const client = require("../index");

module.exports = {
	async loadCommands() {	//only run on bot start
		const commandsInDB = await db.findAll(db.COMMANDS);	//list of commands in DB
		
		let customCommands = {};
		let count = 0;
		
		for(let i = 0; i < commandsInDB.length; i++) {
			let entry = commandsInDB[i];
			
			if(!entry.guildId) continue;
			
			if(!customCommands[entry.guildId]) {
				customCommands[entry.guildId] = {};
			}
			
			customCommands[entry.guildId][entry.commandName] = entry.commandContent;
			count++;
		}
		
		client.customCommands = customCommands;
		console.log(`Loaded ${count} custom commands`);
	},
	
	async addCommand(commandData) {
		if(!client.customCommands[commandData.guildId]) {
			client.customCommands[commandData.guildId] = {};
		}
		
		if(client.customCommands[commandData.guildId][commandData.commandName]) {	//command name exists - remove first
			let deleteSuccess = await this.removeCommand({
				guildId: commandData.guildId,
				commandName: commandData.commandName
			});
			
			if(!deleteSuccess) {
				console.log("Error creating command: " + commandData);
				return;
			}
		}
		
		client.customCommands[commandData.guildId][commandData.commandName] = commandData.commandContent;
		
		await db.insert(db.COMMANDS, commandData);
	},
	
	async removeCommand(commandData) {
		let deleteSuccess = await db.deleteOne(db.COMMANDS, commandData);
		if(deleteSuccess) delete client.customCommands[commandData.guildId][commandData.commandName];
		
		return deleteSuccess;
	}
};

/*
In DB:
[
	{
		_id: new ObjectId("11111"),
		guildId: "22222",
		commandName: "33333",
		commandContent: "44444"
	},
	{
		etc
	}
]

In bot memory:
{
	"guild1" : {
		"command1" : "content",
		"command2" : "content2",
	},
	"guild2" : {
		"command1" : "content",
		"command2" : "content2",
	}
}
*/