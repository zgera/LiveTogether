import jwt from "jsonwebtoken"
import { TokenData } from "../types/auth"

export class authenticationService{
    static createToken(tokenData: TokenData){
        const token = jwt.sign(
            {userId: tokenData.userId, username: tokenData.username},
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
        })
        return token
    }

    static validateToken(encodedToken: string): TokenData{
        const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET) as TokenData
        return decodedToken
    }
}