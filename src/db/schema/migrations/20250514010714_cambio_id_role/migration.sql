/*
  Warnings:

  - You are about to alter the column `idRole` on the `familyuser` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idRole` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `familyuser` DROP FOREIGN KEY `FamilyUser_idRole_fkey`;

-- DropIndex
DROP INDEX `FamilyUser_idRole_fkey` ON `familyuser`;

-- AlterTable
ALTER TABLE `familyuser` MODIFY `idRole` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    MODIFY `idRole` INTEGER NOT NULL,
    ADD PRIMARY KEY (`idRole`);

-- AddForeignKey
ALTER TABLE `FamilyUser` ADD CONSTRAINT `FamilyUser_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`idRole`) ON DELETE RESTRICT ON UPDATE CASCADE;
