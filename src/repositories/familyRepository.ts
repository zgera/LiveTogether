import { Family } from "@prisma/client";

import { db } from "../db/db";

export class FamilyRepository {

    static async createFamily(name: string): Promise<Family> {
        return await db.family.create({
            data: {
                name
            }
        })
    }

    static async changeName(idFamily:string, name: string): Promise<Family> {
        return await db.family.update({
            where: { idFamily},
            data: {
                name
            }
        })
    }

    static async deleteFamily(idFamily: string): Promise<Family> {
        return await db.family.delete({ where: { idFamily }})
    }

    static async getFamily(idFamily: string): Promise<Family | null> {
        return await db.family.findUnique({ where: { idFamily }});
    }
}