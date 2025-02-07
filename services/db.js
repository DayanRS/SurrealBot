require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoUri);

let isConnected = false;
let dbCollections = [];

module.exports = {
  PUNISHES: 0,
  WARNINGS: 1,
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

      process.on("SIGINT", () => {
        //close db connection when the app closes
        mongoClient.close(() => {
          console.log("MongoDB connection closed");
          process.exit(0);
        });
      });
    } catch (err) {
      console.error(err);
    }
  },

  async findOne(collection, query) {
    try {
      if (!isConnected) await module.exports.connect(); //connect to db if not already

      const result = await dbCollections[collection].findOne(query);

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async findAll(collection) {
    try {
      if (!isConnected) await module.exports.connect(); //connect to db if not already

      const result = await dbCollections[collection].find(
        {},
        {
          //gets all entries
          sort: {
            duration: 1, //sort lowest to highest duration
          },
        }
      );

      return result.toArray();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  //TODO: query, update, and maybe options, should all be passed in as params to keep logic separate
  async findOneAndUpdate(collection, entry) {
    try {
      if (!isConnected) await module.exports.connect(); //connect to db if not already

      let query = {
        guildId: entry.guildId,
        userId: entry.userId,
      };

      let update = {
        $push: {
          warnings: {
            $each: entry.warnings,
          },
        },
      };

      let options = {
        returnDocument: "after",
        upsert: true, //create entry if it doesn't already exist
      };

      const result = await dbCollections[collection].findOneAndUpdate(
        query,
        update,
        options
      );

      return result.value;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async insert(collection, entry) {
    try {
      if (!isConnected) await module.exports.connect(); //connect to db if not already

      const result = await dbCollections[collection].insertOne(entry);

      if (result.insertedId) console.log("Entry added to database");
    } catch (err) {
      console.error(err);
    }
  },

  async deleteOne(collection, query) {
    try {
      if (!isConnected) await module.exports.connect(); //connect to db if not already

      const result = await dbCollections[collection].deleteOne(query);

      if (result.deletedCount === 1) {
        console.log("Entry removed from database");
        return true;
      }

      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  /**
   * For manual database maintenance, creating a new field for existing entries - use sparingly!
   * @returns null
   */
  async appendField(collectionType) {
    try {
      if (!isConnected) await module.exports.connect(); //connect to db if not already

      let results;

      if (collectionType === module.exports.PUNISHES) {
        let query = {
          refId: { $exists: false }, //query for field by non-existence (property is the new one to add)
        };

        let update = {
          $set: {
            //field update operator
            refId:
              "p_" + Math.floor(Math.random() * 1000000000000).toString(36),
          },
        };

        let options = {
          returnDocument: "after",
          upsert: false, //don't create new value if it doesn't exist
        };

        results = await dbCollections[module.exports.PUNISHES].findOneAndUpdate(
          query,
          update,
          options
        );
      } else if (collectionType === module.exports.WARNINGS) {
        query = {
          warnings: {
            $elemMatch: {
              refId: { $exists: false }, //query for field existence within array
            },
          },
        };

        let update = {
          $set: {
            //field update operator
            "warnings.$.refId":
              "w_" + Math.floor(Math.random() * 1000000000000).toString(36), //only update the first element
            //"warnings.$[elem].refId" : "w_" + Math.floor(Math.random()*1000000000000).toString(36),	//using arrayFilters updates all elements in the array
          },
        };

        let options = {
          returnDocument: "after",
          upsert: false, //don't create new value if it doesn't exist
          //arrayFilters: [{"elem.refId": {$exists: false}}]
        };

        results = await dbCollections[module.exports.WARNINGS].findOneAndUpdate(
          query,
          update,
          options
        );
      }

      return results.value;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  //specifically for warn/punish history lookup - probably should be generalised
  async testSearch(query) {
    try {
      if (!isConnected) await module.exports.connect(); //connect to db if not already

      const results = await dbCollections[module.exports.WARNINGS].aggregate([
        {
          $match: {
            userId: query.userId,
            guildId: query.guildId,
          },
        },
        {
          $lookup: {
            from: "Punishments",
            localField: "userId",
            foreignField: "userId",
            as: "punishments",
          },
        },
      ]);

      const resultsArr = await results.toArray();

      return resultsArr;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
};
