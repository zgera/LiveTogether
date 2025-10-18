import { Invitation } from "@prisma/client";

import { invitationWithFamily } from "../types/invitationWithFamily";
import { invitationWithUser } from "../types/invitationWithUser";

import { db } from "../db/db";

export class InvitationRepository {

    static async createInvitation(idFamily: string, idUserInvited: string, idUserInviter: string): Promise<Invitation> {
        let invitation = await db.invitation.create({
            data: {
                idFamily: idFamily,
                idUserInvited: idUserInvited,
                idUserInviter: idUserInviter,
                accepted: null
            }
        });
        return invitation;
    }

    static async getInvitation(idInvitation: string): Promise<Invitation | null> {
        return db.invitation.findUnique({
            where: {
                idInvitation: idInvitation
            }
        });
    }

    static async getInvitationByUserFamily(idUser: string, idFamily: string): Promise<Invitation | null>{
        const invitation = await db.invitation.findFirst({
            where: {
                idUserInvited: idUser,
                idFamily: idFamily
            }
        });
        return invitation;
    }

    static async getInvitationsSentToUserByUserId(idUser: string): Promise<invitationWithFamily[]> { 
        let invitations = await db.invitation.findMany({
            where: {
                idUserInvited: idUser,
                accepted: null
            },
            include: {
                family: true
            }
        });
        return invitations;
    }

    static async markInvitationsAsSeen(idUser: string): Promise<void> {
        await db.invitation.updateMany({
            where: {
                idUserInvited: idUser,
                seen: false
            },
            data: {
                seen: true
            }
        });
    }

    static async getUnseenInvitationsCount(idUser: string): Promise<number> {
        const count = await db.invitation.count({
            where: {
                idUserInvited: idUser,
                seen: false
            }
        });
        return count;
    }

    static async getInvitationsSentFromFamily(idFamily: string): Promise<invitationWithUser[]> {
        let invitations = await db.invitation.findMany({
            where: {
                idFamily: idFamily,
            },
            include: {
                userInvited: true,
            }
        });
        return invitations;
    }

    static async acceptInvitation(idInvitation: string): Promise<Invitation> {
        let invitation = await db.invitation.update({
            where: {
                idInvitation: idInvitation
            },
            data: {
                accepted: true
            }
        });
        return invitation;
    }

    static async rejectInvitation(idInvitation: string): Promise<Invitation> {
        let invitation = await db.invitation.update({
            where: {
                idInvitation: idInvitation
            },
            data: {
                accepted: false
            }
        });
        return invitation;
    }
}