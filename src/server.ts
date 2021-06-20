import express from "express";
import { ApolloServer } from "apollo-server-express";
const fs = require("fs");
const path = require("path");

// local utils
import config from "./config/config";
import logger from "./utils/logger";

// graphql context
import { context } from "./context";

// graphql resolves
import * as Query from "./resolvers/Query";
import * as Author from "./resolvers/Author";
import * as Book from "./resolvers/Book";
import * as Mutation from "./resolvers/Mutation";

const resolvers = {
    Query,
    Author,
    Book,
    Mutation,
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
    resolvers,
    context,
});

const app = express();
server.applyMiddleware({ app });

const PORT = config.port || 4000;

app.listen({ port: PORT }, () =>
    logger.info(
        `Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    ),
);

process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});
