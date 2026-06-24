const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("@better-auth/mongo-adapter");
const { MongoClient } = require("mongodb");

// MongoDB client for Better Auth adapter
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("startupforge");

const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "collaborator",
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
});

module.exports = { auth };
