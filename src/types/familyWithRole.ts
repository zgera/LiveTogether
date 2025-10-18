import { Family } from "@prisma/client";

export type FamilyWithRole = Family & {
    role: string;
};
