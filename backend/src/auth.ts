import { sign } from 'jsonwebtoken';
import {User} from '../node_modules/@generated/type-graphql/models/User'



export const createTokens = (user: User) => {
    const refreshToken = sign({ userId: user.id, tokenCount: user.tokenCount }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "7d"
    });
    
    const accessToken = sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "15min"
    });

    return {refreshToken, accessToken}
}