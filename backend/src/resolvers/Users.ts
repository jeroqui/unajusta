import * as bcrypt from "bcrypt";
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { User } from '../../node_modules/@generated/type-graphql/models/User';
import { createTokens } from "../auth";

@Resolver(User)
export class CustomUserResolver {
    @Mutation(() => User)
    async registerUser(
        @Ctx() ctx: any,
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Arg("email") email: string,
        @Arg("nom") nom: string,
        @Arg("cognoms") cognoms: string
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return ctx.prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                persona: {
                    create: {
                        email,
                        nom,
                        cognoms
                    }
                }
            },
        });
    };


    @Mutation(() => User)
    async loginUser(
        @Ctx() ctx: any,
        @Arg("username") username: string,
        @Arg("password") password: string
    ) {
        const user = await ctx.prisma.user.findUnique({ where: { username } });
        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return null;
        }

        const { accessToken, refreshToken } = createTokens(user);

        ctx.res.cookie("refresh-token", refreshToken);
        ctx.res.cookie("access-token", accessToken);
        ctx.req.userId = user.id;

        return user;
    };


    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: any) {
        if (!ctx.req.userId) {
            return false;
        }

        const user = await ctx.prisma.user.update({
            where: { id: ctx.req.userId },
            data: {
                tokenCount: {
                    increment: 1
                }
            }
        });

        ctx.res.clearCookie('acces-token');
        ctx.res.clearCookie('refresh-token');

        return true;
    }
}
