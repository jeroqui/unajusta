import * as bcrypt from "bcrypt";
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';

import {User} from '../../node_modules/@generated/type-graphql/models/User'

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
    }
}