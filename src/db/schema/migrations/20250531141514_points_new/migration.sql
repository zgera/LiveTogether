/*
  Warnings:

  - You are about to drop the column `auraPoints` on the `difficulty` table. All the data in the column will be lost.
  - You are about to drop the column `auraPoints` on the `familyuser` table. All the data in the column will be lost.
  - Added the required column `points` to the `Difficulty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `FamilyUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `difficulty` DROP COLUMN `auraPoints`,
    ADD COLUMN `points` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `familyuser` DROP COLUMN `auraPoints`,
    ADD COLUMN `points` INTEGER NOT NULL;
