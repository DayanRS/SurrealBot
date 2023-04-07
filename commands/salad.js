module.exports = {
	data: {
		name: "salad",
		description: "Toggle salad mode"
	},
	
	async execute(interaction) {
		await interaction.deferReply();
		interaction.isDeferred = true;

		await interaction.editReply({
			content: `This is illegal. Check behind you.`,
			ephemeral: true
		});
		return;
		
		// const saladRole = ((await interaction.guild.roles.fetch()).filter((role) => role.name === "Salad")).at(0);
		
		// if(!saladRole) {
		// 	await interaction.editReply({
		// 		content: `"Salad" role does not exist in this server.`,
		// 		ephemeral: true
		// 	});
		// 	return;
		// }
		
		// if(interaction.member.roles.cache.some(role => role.id === saladRole.id)) {
		// 	await interaction.member.roles.remove(saladRole);
		// 	await interaction.editReply({
		// 		content: `Salad mode disabled`,
		// 		ephemeral: true
		// 	});
		// 	return;
		// } else {
		// 	await interaction.member.roles.add(saladRole);
		// 	await interaction.editReply({
		// 		content: `:salad: ${interaction.member.user.username} enabled salad mode! :salad:`,
		// 		ephemeral: true
		// 	});
		// 	return;
		// }
	}
};