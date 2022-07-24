const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var _db;
var _dbelFashion;
module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            if (db) {
                _db = db.db("products");
                _dbelFashion = db.db("elFashion");
                console.log("Successfully, connected to MongoDB");
            }
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    },
    getDbElFashion: () => {
        return _dbelFashion;
    },
    connectMongoose: async () => {
        try {
            const connectionParams = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            };
            await mongoose.connect(process.env.MONGODB_URI, connectionParams);
            console.log("connected to database");
        } catch (error) {
            console.log(error);
            console.log("could not connect to database");
        }
    }
};