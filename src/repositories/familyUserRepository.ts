import { FamilyUser } from "@prisma/client";

import { db } from "../db/db";

class FamilyUserRepository {

    async userJoinFamily(userId:string, familyId: string): Promise<FamilyUser> {}

    async userLeaveFamily(userId: string, familyId:string): Promise<FamilyUser> {}

    async getFamiliesByUsers(userId: string): Promise<Family[]> {}

    async getFamilyMembers(idFamily: string): Promise<User[]> {}

    async getFamilyMembersByRole(idFamily: string, idRole:string): Promise<User[]> {}

    async changeMemberRoleByFamily(idFamily: string, idUser: string, idRole:string): Promise<FamilyUser> {}

    async changeUserPoints(idFamily:string, idUser: string, points: number): Promise<FamilyUser> {}
}