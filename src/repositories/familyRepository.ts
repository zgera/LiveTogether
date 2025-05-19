import { Family } from "@prisma/client";

import { db } from "../db/db";

export class FamilyRepository {

    async createFamily(name: string): Promise<Family> {
        return await db.family.create({
            data: {
                name
            }
        })
    }

    async changeName(idFamily:string, name: string): Promise<Family> {
        return await db.family.update({
            where: { idFamily},
            data: {
                name
            }
        })
    }

    async deleteFamily(idFamily: string): Promise<Family> {
        return await db.family.delete({ where: { idFamily }})
    }
}