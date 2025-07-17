import {User} from "@prisma/client";

export type UserSafe = Omit<User, 'password'>;