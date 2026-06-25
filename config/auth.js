const { mongoClient, dbName } = require("./db");

const createAuth = async () => {
  if (!mongoClient) {
    console.error("❌ mongoClient is null. Skipping Better Auth configuration.");
    return null;
  }
  const db = mongoClient.db(dbName);

  // Dynamically import better-auth packages (ES modules)
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("@better-auth/mongo-adapter");

  return betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },

    logger: {
      level: "debug",
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
};

module.exports = { createAuth };
