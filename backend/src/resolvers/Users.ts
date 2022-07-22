import { Resolver, Mutation, Arg } from 'type-graphql';

import {User} from '../types/User'

@Resolver(User)
export class UserResolver {
    @Mutation(() => User)
    async registerUser(
        @Arg("username") username: string
    ) {
        return 
    }
}