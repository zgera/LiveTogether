import { Invitation, User } from "@prisma/client";

export type invitationWithUser = Invitation & {
    userInvited: User;
}