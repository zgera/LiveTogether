import {Router} from "express"

import { userService } from "../services/userService"

import { authenticationService } from "../services/authenticationService";

import { TokenData } from "../services/tokenData";

import { autenticarToken } from "./middleware/authMiddleware";

interface CreateUserBody {
  firstName: string,
  lastName: string,
  username: string,
  password: string,
}

const UserService = new userService();

export const userRouter = Router()

userRouter.post("/signin", async (req, res) => {
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

userRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, username, password } = req.body

    const userBody: CreateUserBody = {
        firstName,
        lastName,
        username,
        password
    }

    try {
        const user = await UserService.createUser(userBody)
        res.status(201).send({ user })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al crear el usuario';
        res.status(400).send({ error: message });
    }
})

userRouter.get("/me", autenticarToken, async (req, res) => {
    const { idUser } = req.user;

    try {
        const user = await UserService.getUser(idUser);
        res.send({ user });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error inesperado al obtener el usuario';
        res.status(404).send({ error: message });
    }
})