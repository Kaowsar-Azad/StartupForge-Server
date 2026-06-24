const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "startupforge";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { dbName });
    console.log("✅ MongoDB Connected successfully via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const mongoClient = new MongoClient(uri);

const connectMongoClient = async () => {
  try {
    await mongoClient.connect();
    console.log("✅ MongoClient Connected successfully for Better Auth");
  } catch (error) {
    console.error("❌ MongoClient Connection Error:", error.message);
  }
};

module.exports = { connectDB, connectMongoClient, mongoClient, dbName };