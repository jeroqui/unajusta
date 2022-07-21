import dotenv from 'dotenv';

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';


dotenv.config();


const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => {
            return 'Hello World'
        }
    }
};


async function startServer() {
    const app = express();
    
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({app});

    // app.use
    app.use(express.json());
    
    // Load routes
    app.get('/', (req, res) => {
        res.send('Hi there');
    });
    
    // Start server
    const port = process.env.BACKEND_PORT;
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

startServer();


