import { FamilyUser } from "@prisma/client";

import { db } from "../db/db";


export class FamilyUserRepository {

    async userJoinFamily(idUser:string, idFamily: string, idRole: number): Promise<FamilyUser> {
        return await db.familyUser.create({
            data: {
                idUser,
                idFamily,
                idRole,
                points: 0
            }
        })
    }

    async getFamilyUserRole(idUser: string, idFamily: string): Promise<number | null> {
        const result = await db.familyUser.findFirst({
            where: {
                idUser,
                idFamily
            },
            select: {
                idRole: true
            }
        })
        return result?.idRole ?? null;
    }

    async getFamilyUserId(idUser: string, idFamily: string): Promise<string | null> {
        const result = await db.familyUser.findFirst({
            where: {
                idUser,
                idFamily
            },
            select: {
                idFamilyUser: true,
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

    async getFamilyMembers(idFamily: string): Promise<{idUser: string, idRole: number, points: number}[]> {
        return await db.familyUser.findMany({
            where: {
                idFamily
            },
            select: {
                idUser: true,
                idRole: true,
                points: true
            },

            orderBy: {
                points: "asc"
            }
        })  
    }

    async getFamilyMembersByRole(idFamily: string, idRole:number): Promise<{idUser: string}[]> {
        return await db.familyUser.findMany({
            where: {
                idFamily,
                idRole
            },
            select: {
                idUser: true
            }
        })
    }

    async changeMemberRoleByFamily(idFamily: string, idUser: string, idRole:number): Promise<FamilyUser | null> {
        const idFamilyUser = await this.getFamilyUserId(idUser, idFamily);
        if (idFamilyUser) {
            return await db.familyUser.update({
                where: {
                    idFamilyUser
                },
                data: {
                    idRole: idRole
                }
            })
        }
        return null;
    }

    async addPointsToMemberInFamily(idFamily: string, idUser: string, addedPoints: number): Promise<FamilyUser> {
        const idFamilyUser = await this.getFamilyUserId(idUser, idFamily);

        if (idFamilyUser) {
            return await db.familyUser.update({
                where: {
                    idFamilyUser
                },
                data: {
                    points: {
                        increment: addedPoints
                    }
                }
            });
        }
        throw new Error("El usuario no pertenece a la familia");
    }
}