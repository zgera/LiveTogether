import { FamilyUser } from "@prisma/client";

import { familyUserWithUser } from "../types/famiyUserWithUser";

import { db } from "../db/db";


export class FamilyUserRepository {

    static async userJoinFamily(idUser:string, idFamily: string, idRole: number): Promise<FamilyUser> {
        return await db.familyUser.create({
            data: {
                idUser,
                idFamily,
                idRole,
                points: 0
            }
        })
    }

    static async getFamilyUser(idUser: string, idFamily: string): Promise<FamilyUser | null> {
        return await db.familyUser.findFirst({
            where: {
                idUser,
                idFamily
            }
        })
    }

    static async getFamilyUserRole(idUser: string, idFamily: string): Promise<number | null> {
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

    static async getFamilyUserId(idUser: string, idFamily: string): Promise<string | null> {
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

    static async userLeaveFamily(idUser: string, idFamily:string): Promise<FamilyUser | null> {
        const idFamilyUser = await this.getFamilyUserId(idUser, idFamily);
        if (idFamilyUser) {
            return await db.familyUser.delete({
                where: { idFamilyUser }
            })
        }

        return null;
    }

    static async getFamiliesByUser(idUser: string): Promise<{idFamily: string, idRole: number}[]> {
        return await db.familyUser.findMany({
            where: {
                idUser
            },
            select: {
                idFamily: true,
                idRole: true
            }
        })
    }

    static async getFamilyMembers(idFamily: string): Promise<FamilyUser[]> {
        return await db.familyUser.findMany({
            where: {
                idFamily
            },
            orderBy: {
                points: "asc"
            }
        })  
    }

        static async getFamilyRankings(idFamily: string): Promise<familyUserWithUser[]> {
            const familyUser = await db.familyUser.findMany({
                where: {
                    idFamily
                },
                orderBy: {
                    points: "desc"
                },
                include: {
                    user: true
                }
            })
            return familyUser;
        }

    static async getFamilyAdmin(idFamily: string): Promise<FamilyUser | null> {
        const admin = await db.familyUser.findFirst({
            where: {
                idFamily,
                idRole: 2
            }
        })
        return admin;
    }

    static async getFamilyMembersByRole(idFamily: string, idRole:number): Promise<{idUser: string}[]> {
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

    static async changeMemberRoleByFamily(idFamily: string, idUser: string, idRole:number): Promise<FamilyUser | null> {
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

    static async addPointsToMemberInFamily(idFamily: string, idUser: string, addedPoints: number): Promise<FamilyUser> {
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

    static async subtractPointsFromMemberInFamily(idFamily: string, idUser: string, subtractedPoints: number): Promise<FamilyUser> {
        const idFamilyUser = await this.getFamilyUserId(idUser, idFamily);

        if (idFamilyUser) {
            return await db.familyUser.update({
                where: { idFamilyUser },
                data: {
                    points: {
                        decrement: subtractedPoints
                    }
                }
            });
        }
        throw new Error("El usuario no pertenece a la familia");
    }
}