import jwt from "jsonwebtoken"
import { TokenData } from "./tokenData"

export class authenticationService{
    static createToken(tokenData: TokenData){
        const token = jwt.sign(
            {id: tokenData.userId, username: tokenData.userName},
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
        })
        return token
    }

    static validateToken(encodedToken: string){
        const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET)
        return decodedToken
    }
}