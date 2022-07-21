import dotenv from 'dotenv';

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import {schema} from './schema';

dotenv.config();



async function startServer() {
    const app = express();
    
    const apolloServer = new ApolloServer({
        schema
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


