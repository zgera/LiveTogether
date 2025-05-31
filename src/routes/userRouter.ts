import {Router} from "express"

import jwt from "jsonwebtoken"

import { autenticarToken } from "./middleware/authMiddleware";

import { userService } from "../services/userService"

const UserService = new userService();

export const userRouter = Router()

userRouter.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await UserService.verifyUser(username, password)

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign(
            {id: user.idUser, username: user.username},
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            })
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

