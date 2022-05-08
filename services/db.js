require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@surrealbot.uaqng.mongodb.net/Punishments?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoUri);

let isConnected = false;

module.exports = {
	name: "dbhandler",
	
	async connect() {
		try {
			await mongoClient.connect();
			isConnected = true;
			
			process.on("SIGINT", () => {
				mongoClient.close(() => {
					console.log("MongoDB connection closed");
					process.exit(0);
				});
			});
		} catch(err) {
			console.error(err);
		}
	},
	
	async queryDB(query) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const db = mongoClient.db("SurrealBot");
			const punishes = db.collection("Punishments");
			
			const result = await punishes.findOne(query);
			
			return(result);
			
		} catch(err) {
			console.log(err);
			return(null);
		}
	},
	
	async insert(object) {
		
	}
};
