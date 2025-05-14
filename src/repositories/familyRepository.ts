import { Family } from "@prisma/client";

import { db } from "../db/db";

class FamilyRepository {

    async createFamily(name: string): Promise<Family> {}

    async changeName(idFamily:string, name: string): Promise<Family> {}

    async deleteFamily(familyId: string): Promise<Family> {}
}