import { mongoClient, dbName } from "./db.js";

const createAuth = async () => {
  if (!mongoClient) {
    console.error("❌ mongoClient is null. Skipping Better Auth configuration.");
    return null;
  }
  const db = mongoClient.db(dbName);

  // Dynamically import better-auth packages (ES modules)
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("@better-auth/mongo-adapter");
  const { jwt } = await import("better-auth/plugins");

  return betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.NODE_ENV === "production" 
      ? (process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/api/auth/better-auth` : process.env.BETTER_AUTH_URL) 
      : process.env.BETTER_AUTH_URL,
    trustedOrigins: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "https://startupforge.vercel.app",
      "https://startup-forge-client.vercel.app"
    ],
    plugins: [
      jwt(),
    ],

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
          defaultValue: "unassigned",
        },
        isBlocked: {
          type: "boolean",
          defaultValue: false,
        },
      },
    },

    advanced: {
      defaultCookieAttributes: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  });
};

export { createAuth };
