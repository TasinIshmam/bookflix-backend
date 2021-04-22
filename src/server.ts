import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import {context} from "./context";


const PORT = 4000;
const app = express();

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!'
    },
};

const server = new ApolloServer({ typeDefs, resolvers, context});
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)