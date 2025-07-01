import {Router} from "express"

import { userService } from "../services/userService"

import { authenticationService } from "../services/authenticationService";

import { TokenData } from "../services/tokenData";

const UserService = new userService();

export const userRouter = Router()

userRouter.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await UserService.verifyUser(username, password)

        const tokenData: TokenData = {
            userId: user.idUser,
            userName: user.username
        }

        const token = authenticationService.createToken(tokenData)

        res
            .cookie('acces_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60
            })
            .send({ user })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al iniciar sesión';
        res.status(401).send({ error: message });
    }
})

