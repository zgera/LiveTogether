import { User } from "@prisma/client";

import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/userRepository"

export class userService {
    private repository = new UserRepository  //Manera corta, cuando se compila es como si estuviera en el constructor de la clase

    async createUser(firstName: string, lastName: string, email: string, password: string){

        if (!firstName || !lastName || !email || !password){
            throw new Error("Todos los campos son obligatorios")
        }

        if (!this.isValidEmail(email)){
            throw new Error("Estructura de mail invalida")
        }

        if (password.length < 6){
            throw new Error("La contraseña debe tener minimo 6 caracteres")
        }

        const existing = await this.repository.findByEmail(email)
        if (existing){
            throw new Error("El mail ya esta asignado a un usuario")
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        try {
            const user = await this.repository.createUser(firstName, lastName, email, hashedPassword)
            return user
        } catch (err: any){
            throw new Error("Ocurrio un error al crear el usuario. Intente mas tarde")
        }
    }

    private isValidEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }
}