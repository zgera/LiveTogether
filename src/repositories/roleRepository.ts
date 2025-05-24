import { Role } from "@prisma/client";

import { db } from "../db/db";

export class RoleRepository {

    async getRole(idRole: number): Promise<string | null> {
        const result = await db.role.findUnique({
            where: {
                idRole
            },
            select: {
                name: true
            }
        })

        return result?.name ?? null;
    }

}