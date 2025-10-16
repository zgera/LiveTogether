import { User } from "@prisma/client";

import { db } from "../db/db";

export class UserRepository {

    static async createUser(firstName: string, lastName: string, username: string, password: string): Promise<User> {
        const user = await db.user.create({
            data: {
                firstName,
                lastName,
                username,
                password
            }
        });
        return user;
    }

    static async findByUsername(username: string): Promise<User | null> {
        const user = await db.user.findUnique({
            where: { username }
        });
        return user;
    }

    static async getUser(idUser: string): Promise<User | null> {
        const user = await db.user.findUnique({
            where: { idUser }
        });
        return user;
    }

    //async changePassword(idUser: string, password: string): Promise<User> {}

    //async deleteUser(idUser: string): Promise<User> {}

}