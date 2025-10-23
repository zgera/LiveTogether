import { Task } from "@prisma/client";

import { Difficulty } from "@prisma/client";

import { UserSafe } from "./user";

export type taskWithCreator = Task & {
    creator: UserSafe;
    difficulty: Difficulty;
}

export type taskWithCreatorAndUserAssigned = Task & {
    assignedTo: UserSafe | null;
    creator: UserSafe;
    difficulty: Difficulty;
}