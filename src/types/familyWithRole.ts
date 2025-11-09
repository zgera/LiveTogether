import { Family } from "@prisma/client";

export type FamilyWithRole = Family & {
    members: number;
    role: string;
};
