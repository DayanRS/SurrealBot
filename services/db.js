require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@surrealbot.uaqng.mongodb.net/Punishments?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoUri);

let isConnected = false;

module.exports = {
	async connect() {
		try {
			await mongoClient.connect();
			isConnected = true;
			
			process.on("SIGINT", () => {	//close db connection when the app closes
				mongoClient.close(() => {
					console.log("MongoDB connection closed");
					process.exit(0);
				});
			});
		} catch(err) {
			console.error(err);
		}
	},
	
	async findOne(query) {
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
	
	async findAll() {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const db = mongoClient.db("SurrealBot");
			const punishes = db.collection("Punishments");
			
			const result = await punishes.find({}, {	//gets all entries
				sort: {
					duration: 1		//sort lowest to highest duration
				}
			});
			
			return(result.toArray());
			
		} catch(err) {
			console.log(err);
			return(null);
		}
	},
	
	async insert(entry) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const db = mongoClient.db("SurrealBot");
			const punishes = db.collection("Punishments");
			
			const result = await punishes.insertOne(entry);
			
			console.log(result);
			
		} catch(err) {
			console.log(err);
		}
	}
};
