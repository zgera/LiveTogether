import { User } from "@prisma/client";

import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/userRepository"

export class userService {
    private repository = new UserRepository  //Manera corta, cuando se compila es como si estuviera en el constructor de la clase

    async createUser(firstName: string, lastName: string, username: string, password: string): Promise<User>{

        if (!firstName || !lastName || !username || !password){
            throw new Error("Todos los campos son obligatorios")
        }

        if (password.length < 6){
            throw new Error("La contraseña debe tener minimo 6 caracteres")
        }

        const existing = await this.repository.findByUsername(username)
        if (existing){
            throw new Error("El mail ya esta asignado a un usuario")
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        try {
            const user = await this.repository.createUser(firstName, lastName, username, hashedPassword)
            return user
        } catch (err: any){
            throw new Error("Ocurrio un error al crear el usuario. Intente mas tarde")
        }
    }

    async verifyUser(username: string, password: string): Promise<User>{
        let user: User | null;
        try {
            user = await this.repository.findByUsername(username)
        } catch (err: any){
            throw new Error("Ocurrio un error. Intente mas tarde")
        }

        if (!user){
            throw new Error("Usuario no encontrado")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid){
            throw new Error("Contraseña incorrecta")
        }

        return user
    }
}