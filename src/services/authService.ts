import jwt from "jsonwebtoken"
import { TokenData } from "./tokenData"

export class authService{
    createToken(tokenData: TokenData){
        const token = jwt.sign(
            {id: tokenData.userId, username: tokenData.userName},
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
        })
        return token
    }
}