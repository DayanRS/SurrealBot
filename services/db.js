require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@surrealbot.uaqng.mongodb.net/Punishments?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoUri);

let isConnected = false;
let dbCollections = [];

module.exports = {
	PUNISHES : 0,
	WARNINGS : 1,
	COMMANDS: 2,
	
	async connect() {
		try {
			await mongoClient.connect();
			isConnected = true;
			console.log("Connected to DB");
			
			const db = mongoClient.db("SurrealBot");
			dbCollections[module.exports.PUNISHES] = db.collection("Punishments");
			dbCollections[module.exports.WARNINGS] = db.collection("Warnings");
			dbCollections[module.exports.COMMANDS] = db.collection("Commands");
			
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
				$push: {
					"warnings": {
						$each: entry.warnings
					}
				}
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
	
	async testUpdate() {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			let query = {
				guildId: "224476458523951104",
				userId: "714857399328178268"
			};
			
			let update = {
				$push: {
					"warnings": {
						$each: entry.warnings
					}
				}
			};
			
			let options = {
				returnDocument: "after",
				upsert: false
			};
			
			console.log(dbCollections[1].findOne);
			
			const result = await dbCollections[1].findOneAndUpdate(query, update, options);
			
			return result.value;
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
				return true;
			}
			
			return false;
			
		} catch(err) {
			console.error(err);
			return false;
		}
	},
	
	/**
	 * For manual database maintenance, creating a new field for existing entries - use sparingly!
	 * @returns null
	 */
	async appendField() {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const HARDCODED_COLL_TOGGLE = module.exports.WARNINGS;	//manually choose which collection to modify
			
			let queries = [];
			
			queries[0] = {
				refId: {$exists: false}		//query for field by non-existence (property is the new one to add)
			};
			
			queries[1] = {
				warnings: {
					$elemMatch: {
						refId: {$exists: false}		//query for field existence within array
					}
				}
			};
			
			let update = {
				$set: {		//field update operator
					"warnings.$.refId" : "w_" + Math.floor(Math.random()*1000000000000).toString(36),	//only update the first element
					//"warnings.$[elem].refId" : "w_" + Math.floor(Math.random()*1000000000000).toString(36),	//using arrayFilters updates all elements in the array
				}
			};
			
			let options = {
				returnDocument: "after",
				upsert: false,	//don't create new value if it doesn't exist
				//arrayFilters: [{"elem.refId": {$exists: false}}]
			};
			
			const punishResults = await dbCollections[HARDCODED_COLL_TOGGLE].findOneAndUpdate(queries[1], update, options);
			
			return null;
		} catch(err) {
			console.error(err);
			return(null);
		}
	},
	
	//specifically for warn/punish history lookup - probably should be generalised
	async testSearch(query) {
		try {
			if(!isConnected) await module.exports.connect();	//connect to db if not already
			
			const results = await dbCollections[module.exports.WARNINGS].aggregate(
				[{
					$match: {
						userId: query.userId, 
						guildId: query.guildId
					}
				}, {
					$lookup: {
						from: "Punishments", 
						localField: "userId", 
						foreignField: "userId", 
						as: "punishments"
					}
				}]
			);
			
			const resultsArr = await results.toArray();
			
			return resultsArr;
		} catch(err) {
			console.error(err);
			return(null);
		}
	}
};
