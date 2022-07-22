import dotenv from 'dotenv';

import "reflect-metadata";

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';

import { resolvers } from "@generated/type-graphql";
import { PrismaClient } from '@prisma/client';

import { CustomUserResolver } from './resolvers/Users';
import { verify } from 'jsonwebtoken';
import { createTokens } from './auth';

dotenv.config();


async function startServer() {
    const app = express();

    const prisma = new PrismaClient();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [CustomUserResolver, ...resolvers],
            validate: false,
        }),
        context: ({req, res}: any) => ({ prisma, req, res }),
    });

    await apolloServer.start();
    
    // app.use
    app.use(express.json());
    app.use(cookieParser())

    app.use(async (req: any, res, next) => {
        const accessToken = req.cookies['access-token'];
        const refreshToken = req.cookies['refresh-token'];

        if(!refreshToken && !accessToken) {
            return next();
        }

        try {
            const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;
            req.userId = data.userId;
        } catch {}

        if (!refreshToken) {
            return next();
        }

        let data;

        try {
            data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
        } catch {
            return next();
        }

        const user = await prisma.user.findUnique({where: {id: data.userId}});
        // invalid token, or invalidated token
        if (!user || user.tokenCount !== data.tokenCount) {
            return next();
        }

        const newTokens = createTokens(user);
        res.cookie("refresh-token", newTokens.refreshToken);
        res.cookie("access-token", newTokens.accessToken);
        req.userId = user.id;

        next()
    });

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


