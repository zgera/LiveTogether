import { User } from "@prisma/client";
import { UserSafe } from "../types/user";
import { TokenData } from "../types/auth";

import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/userRepository"

const MAX_CHARACTERS_FOR_USERNAME = 15
const MIN_CHARACTERS_FOR_USERNAME = 4
const MIN_CHARACTERS_FOR_PASSWORD = 6
const CHARACTERS_NOT_ALLOWED = /[<>'"{}()\/\\]/ // (regex)
const saltRounds = 10

interface CreateUserBody {
  firstName: string,
  lastName: string,
  username: string,
  password: string,
}

// clase UserValidator abajo al fondo

export class userService {
    
    // Repositorio
    private repository = new UserRepository  //Manera corta, cuando se compila es como si estuviera en el constructor de la clase
    
    private userValidator = new UserValidator

    private createUserSafe(user: User): UserSafe {
        const { password, ...userSafe } = user;
        return userSafe;
    }

    async createUser(userData: CreateUserBody): Promise<UserSafe>{
        await this.userValidator.validate(userData, this.repository)
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

        try {
            const user = await this.repository.createUser(userData.firstName, userData.lastName, userData.username, hashedPassword)
            return this.createUserSafe(user)
        } catch (err: any){
            throw new Error("Ocurrio un error al crear el usuario. Intente mas tarde")
        }
    }

    async verifyUser(username: string, password: string): Promise<UserSafe>{
        if (!username || !password) {
            throw new Error("Todos los campos son obligatorios")
        }0.

        const user = await this.getUserCompleteByUsername(username)

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid){
            throw new Error("Contraseña incorrecta")
        }

        return this.createUserSafe(user);
    }

    private async getUserComplete(idUser: string): Promise<User> {
        if (!idUser) {
            throw new Error("El id del usuario es obligatorio")
        }

        const user = await this.repository.getUser(idUser)

        if (!user) {
            throw new Error("Usuario no encontrado")
        }

        return user
    }

    async getUser(idUser: string): Promise<UserSafe> {
        const user = await this.getUserComplete(idUser)
        return this.createUserSafe(user);
    }

    private async getUserCompleteByUsername(username: string): Promise<User> {
        if (!username) {
            throw new Error("El id del usuario es obligatorio")
        }

        const user = await this.repository.findByUsername(username)

        if (!user) {
            throw new Error("Usuario no encontrado")
        }

        return user
    }

}


class UserValidator { 
    async validate(userData:CreateUserBody, repository: UserRepository): Promise<boolean> {
        await this.validateUsername(userData.username, repository)
        this.validatePassword(userData.password)
        this.validateName(userData.firstName)
        this.validateName(userData.lastName)
        return true;
    }

    private async validateUsername(username: string, repository:UserRepository): Promise<void> {
        this.validateName(username)
        let existing = await repository.findByUsername(username)
        if (existing){
            throw new Error("Ese nombre ya esta ocupado.")
        }
    }

    private validateName(name: string): void {
        if (name.length > MAX_CHARACTERS_FOR_USERNAME) {
            throw Error(`Los nombres no pueden tener mas de ${MAX_CHARACTERS_FOR_USERNAME} o menos de ${MIN_CHARACTERS_FOR_USERNAME} caracteres.`)
        }
        if (CHARACTERS_NOT_ALLOWED.test(name)) {
            throw Error(`Los nombres no pueden contener caracteres especiales.`)
        }
    }

    private validatePassword(password: string): void {
        if (password.length < MIN_CHARACTERS_FOR_PASSWORD) {
            throw Error(`La contraseña no puede tener menos de ${MIN_CHARACTERS_FOR_PASSWORD} caracteres.`)
        }
    }
}