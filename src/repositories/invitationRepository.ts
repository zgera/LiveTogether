import { Invitation } from "@prisma/client";

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

    static async getInvitationsSentToUserByUserId(idUser: string): Promise<Invitation[]> { 
        let invitations = await db.invitation.findMany({
            where: {
                idUserInvited: idUser,
                accepted: null
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

    static async getInvitationsSentFromFamily(idFamily: string): Promise<Invitation[]> {
        let invitations = await db.invitation.findMany({
            where: {
                idFamily: idFamily,
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