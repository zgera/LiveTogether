import { User } from "@prisma/client";

import { db } from "../db/db";

class UserRepository {

    async createUser(firstName: string, lastname: string, email: string, password: string): Promise<User> {}

    async changeEmail(idUser: string, email: string): Promise<User> {}

    async changePassword(idUser: string, password: string): Promise<User> {}

    async deleteUser(idUser: string): Promise<User> {}

}