import { Invitation } from "@prisma/client";

import { db } from "../db/db";

export class InvitationRepository {

    async createInvitation(idFamily: string, idUserInvited: string, idUserInviter: string): Promise<Invitation> {
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

    getInvitation(idInvitation: string): Promise<Invitation | null> {
        return db.invitation.findUnique({
            where: {
                idInvitation: idInvitation
            }
        });
    }

    async getInvitationsSentToUserByUserId(idUser: string): Promise<Invitation[]> { 
        let invitations = await db.invitation.findMany({
            where: {
                idUserInvited: idUser,
            }
        });
        return invitations;
    }

    async getInvitationsSendedFromFamily(idFamily: string): Promise<Invitation[]> {
        let invitations = await db.invitation.findMany({
            where: {
                idFamily: idFamily,
            }
        });
        return invitations;
    }

    async acceptInvitation(idInvitation: string): Promise<Invitation> {
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

    async rejectInvitation(idInvitation: string): Promise<Invitation> {
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