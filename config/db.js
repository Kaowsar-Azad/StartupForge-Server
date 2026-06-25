const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "startupforge";

const connectDB = async () => {
  if (!uri) {
    console.error("❌ MongoDB URI is not defined in environment variables!");
    return;
  }
  try {
    await mongoose.connect(uri, { 
      dbName,
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout to avoid serverless function hang
    });
    console.log("✅ MongoDB Connected successfully via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
};

const mongoClient = uri ? new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }) : null;

const connectMongoClient = async () => {
  if (!mongoClient) {
    console.error("❌ MongoClient connection skipped: MONGODB_URI is not defined");
    return;
  }
  try {
    await mongoClient.connect();
    console.log("✅ MongoClient Connected successfully for Better Auth");
  } catch (error) {
    console.error("❌ MongoClient Connection Error:", error.message);
  }
};

module.exports = { connectDB, connectMongoClient, mongoClient, dbName };