import { Difficulty } from "@prisma/client";

import { db } from "../db/db";

export class DifficultyRepository {
    static async getDifficultyById(idDifficulty: number): Promise<Difficulty | null> {
        return await db.difficulty.findUnique({
            where: { idDifficulty }
        });
    }
}   