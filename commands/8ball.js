const { Constants } = require("discord.js");

module.exports = {
	data: {
		name: "8ball",
		description: "Consult the 8ball for wisdom",
        options: [
			{
				name: "question",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				description: "The question you wish to be answered",
			}
		]
	},
	async execute(interaction) {
        let question = interaction.options.getString("question");
        let questionOld = question
        if(question) {
            question = question.replace(/(@everyone|@here)/gmi, "");
        }
        let triedToPing = questionOld != question;
        let pingMessage = "You tried pinging everyone so you're not getting an answer this time.";
        if(triedToPing) question = "";
        await interaction.reply({
            content: `You asked ${question ? `"${question}"` : "nothing"}... ${triedToPing ? pingMessage : this.get8Ball()}`
        });

	},
    get8Ball() {
        let answers = ["It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful.",
        "Meow."];
        return answers[Math.floor(Math.random() * answers.length)];
    }
};