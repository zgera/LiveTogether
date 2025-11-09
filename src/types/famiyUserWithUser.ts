import { FamilyUser, User } from "@prisma/client";

export type familyUserWithUser = {
    idFamilyUser: string;
    idUser: string;
    idRole: number;
    points: number;

    user: {
        firstName: string;
        lastName: string;
        username: string;
    };
}