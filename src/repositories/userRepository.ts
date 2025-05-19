import { User } from "@prisma/client";

import { db } from "../db/db";

export class UserRepository {

    async createUser(firstName: string, lastName: string, email: string, password: string): Promise<User> {
        const user = await db.user.create({
            data: {
                firstName,
                lastName,
                email,
                password
            }
        });
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await db.user.findUnique({
            where: { email }
        });
        return user;
    }

    async changeEmail(idUser: string, email: string): Promise<User> {}

    async changePassword(idUser: string, password: string): Promise<User> {}

    async deleteUser(idUser: string): Promise<User> {}

}