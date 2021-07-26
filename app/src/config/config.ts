import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    dotenv.config({ path: ".env" }); //load environment
}

if (!process.env.NODE_ENV) {
    throw new Error("Could not detect NODE_ENV, exiting.");
}

if (!process.env.DATABASE_URL) {
    throw new Error("Could not detect DATABASE_URL inside the environment.");
}

if (!process.env.JWT_SECRET) {
    throw new Error("Could not detect JWT_SECRET inside the environment.");
}

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET as string,
    database: {
        databaseUrl: process.env.DATABASE_URL,
    },
    logger: {
        logLevel: process.env.LOG_LEVEL || "info",
    },
    feed: {
        highlightBookCount: 3,
        maxGenreBasedLists: 5,
        extraCategoriesForRandomization: 5, // a few extra categories. Used to make the feed non-deterministic
    },
};

export default config;
