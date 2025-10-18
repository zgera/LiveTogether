import { FamilyUser, User } from "@prisma/client";

export type familyUserWithUser = FamilyUser & {
    user: User;
}