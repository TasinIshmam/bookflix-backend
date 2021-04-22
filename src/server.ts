import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { context } from './context';
import config from './config/config';
import logger from './utils/logger';

const app = express();

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};

const server = new ApolloServer({ typeDefs, resolvers, context });
server.applyMiddleware({ app });

const PORT = config.port || 4000;

app.listen({ port: PORT }, () =>
    logger.info(
        `Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    ),
);

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});
