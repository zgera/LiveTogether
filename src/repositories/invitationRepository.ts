import { Invitation } from "@prisma/client";

import { db } from "../db/db";

export class InvitationRepository {

    async getInvitationsSentToUserByUserId(idUser: string): Promise<Invitation[]> { // en el service primero hacer user.findByUsername()
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
}