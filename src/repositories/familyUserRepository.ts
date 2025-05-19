import { FamilyUser } from "@prisma/client";

import { db } from "../db/db";

export class FamilyUserRepository {

    async userJoinFamily(idUser:string, idFamily: string): Promise<FamilyUser> {
        return await db.familyUser.create({
            data: {
                idUser,
                idFamily,
                idRole: 2,
                auraPoints: 0
            }})
    }

    async getFamilyUserId(idUser: string, idFamily: string): Promise<string | null> {
        const result = await db.familyUser.findFirst({
            where: {
                idUser,
                idFamily
            },
            select: {
                idFamilyUser: true
            }
        })

        return result?.idFamilyUser ?? null;
    }

    async userLeaveFamily(idUser: string, idFamily:string): Promise<FamilyUser | null> {
        const idFamilyUser = await this.getFamilyUserId(idUser, idFamily);
        if (idFamilyUser) {
            return await db.familyUser.delete({
                where: { idFamilyUser }
            })
        }

        return null;
    }

    async getFamiliesByUser(idUser: string): Promise<{idFamily: string}[]> {
        return await db.familyUser.findMany({
            where: {
                idUser
            },
            select: {
                idFamily: true
            }
        })
    }

    async getFamilyMembers(idFamily: string): Promise<{idUser: string}[]> {
        return await db.familyUser.findMany({
            where: {
                idFamily
            },
            select: {
                idUser: true
            }
        })
    }

    async getFamilyMembersByRole(idFamily: string, idRole:string): Promise<User[]> {}

    async changeMemberRoleByFamily(idFamily: string, idUser: string, idRole:string): Promise<FamilyUser> {}

    async changeUserPoints(idFamily:string, idUser: string, points: number): Promise<FamilyUser> {}
}