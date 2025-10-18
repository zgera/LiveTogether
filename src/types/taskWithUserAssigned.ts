import { Task } from "@prisma/client";

import { UserSafe } from "./user";

export type taskWithUserAssigned = Task & {
    assignedTo: UserSafe | null;
}