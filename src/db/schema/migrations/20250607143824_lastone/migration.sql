/*
  Warnings:

  - You are about to drop the column `completed` on the `task` table. All the data in the column will be lost.
  - Added the required column `completedByAdmin` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completedByUser` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` DROP COLUMN `completed`,
    ADD COLUMN `completedByAdmin` BOOLEAN NOT NULL,
    ADD COLUMN `completedByUser` BOOLEAN NOT NULL;
