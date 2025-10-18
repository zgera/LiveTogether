import { Invitation, Family } from "@prisma/client";

export type invitationWithFamily = Invitation & {
    family: Family;
}