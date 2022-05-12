require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@surrealbot.uaqng.mongodb.net/Punishments?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoUri);

let isConnected = false;
let dbCollections = [];

module.exports = {
	PUNISHES : 0,
	WARNINGS : 1,
	
	async connect() {
		try {
			await mongoClient.connect();
			isConnected = true;
			
			const db = mongoClient.db("SurrealBot");
			dbCollections[module.exports.PUNISHES] = db.collection("Punishments");
			dbCollections[module.exports.WARNINGS] = db.collection("Warnings");
			
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
	
	async findOne(collection, query) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const result = await dbCollections[collection].findOne(query);
			
			return(result);
			
		} catch(err) {
			console.error(err);
			return(null);
		}
	},
	
	async findAll(collection) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const result = await dbCollections[collection].find({}, {	//gets all entries
				sort: {
					duration: 1		//sort lowest to highest duration
				}
			});
			
			return(result.toArray());
			
		} catch(err) {
			console.error(err);
			return(null);
		}
	},
	
	//TODO: query, update, and maybe options, should all be passed in as params to keep logic separate
	async findOneAndUpdate(collection, entry) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			let query = {
				guildId: entry.guildId,
				userId: entry.userId
			};
			
			let update = {
				$push: { "warnings": entry.warnings[0] }
			};
			
			let options = {
				returnDocument: "after",
				upsert: true	//create entry if it doesn't already exist
			};
			
			const result = await dbCollections[collection].findOneAndUpdate(query, update, options);
			
			return(result.value);
			
		} catch(err) {
			console.error(err);
			return(null);
		}
	},
	
	async insert(collection, entry) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const result = await dbCollections[collection].insertOne(entry);
			
			if(result.insertedId) console.log("Entry added to database");
			
		} catch(err) {
			console.error(err);
		}
	},
	
	async deleteOne(collection, query) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const result = await dbCollections[collection].deleteOne(query);
			
			if(result.deletedCount === 1) {
				console.log("Entry removed from database");
			}
		} catch(err) {
			console.error(err);
		}
	}
};
