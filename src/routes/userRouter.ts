import {Router} from "express"

import jwt from "jsonwebtoken"

import { userService } from "../services/userService"

const UserService = new userService();

export const userRouter = Router()

userRouter.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await UserService.verifyUser(username, password)
        const token = jwt.sign({id: user.idUser, username: user.username}, "secret")
    }   
})

