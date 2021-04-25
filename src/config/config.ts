import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' }); //load environment
}

if (!process.env.NODE_ENV) {
    throw new Error("Could not detect NODE_ENV, exiting.");
}

if (!process.env.DATABASE_URL) {
    throw new Error("Could not detect DATABASE_URL inside the environment.");
}

const config = {
    env:  process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
        databaseUrl: process.env.DATABASE_URL,
    },
    logger: {
        logLevel: process.env.LOG_LEVEL || 'info',
    },
};

export default config;
