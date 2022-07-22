import dotenv from 'dotenv';

import "reflect-metadata";

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { resolvers } from "@generated/type-graphql";
import { PrismaClient } from '@prisma/client';

import { CustomUserResolver } from './resolvers/Users';

dotenv.config();


async function startServer() {
    const app = express();

    const prisma = new PrismaClient();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [CustomUserResolver, ...resolvers],
            validate: false,
        }),
        context: () => ({ prisma }),
    });

    await apolloServer.start();
    
    // app.use
    app.use(express.json());

    apolloServer.applyMiddleware({app});

    
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


