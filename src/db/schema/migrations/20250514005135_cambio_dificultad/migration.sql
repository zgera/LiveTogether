/*
  Warnings:

  - You are about to drop the column `difficulty` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `auraPoints` on the `users` table. All the data in the column will be lost.
  - Added the required column `auraPoints` to the `FamilyUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idDifficulty` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `familyuser` ADD COLUMN `auraPoints` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `difficulty`,
    ADD COLUMN `idDifficulty` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `auraPoints`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Difficulty` (
    `idDifficulty` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `auraPoints` INTEGER NOT NULL,

    PRIMARY KEY (`idDifficulty`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_idDifficulty_fkey` FOREIGN KEY (`idDifficulty`) REFERENCES `Difficulty`(`idDifficulty`) ON DELETE RESTRICT ON UPDATE CASCADE;
