module.exports = {
	name: "interactionCreate",
	
	async execute(interaction) {
		const client = interaction.client;
		
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
	}
};