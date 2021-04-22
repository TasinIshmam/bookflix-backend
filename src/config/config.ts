import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' }); //load config files
} else {
    throw new Error('Could not load .env file.');
}

const env: string = process.env.NODE_ENV || 'development'; //assume development unless otherwise specified

const config = {
    env,
    port: process.env.PORT,
    database: {
        databaseUrl: process.env.DATABASE_URL,
    },
    logger: {
        logLevel: process.env.LOG_LEVEL || 'info',
    },
};

export default config;
