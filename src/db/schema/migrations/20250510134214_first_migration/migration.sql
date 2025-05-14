-- CreateTable
CREATE TABLE `Family` (
    `idFamily` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idFamily`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamilyUser` (
    `idFamilyUser` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `idFamily` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idFamilyUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `idUser` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `auraPoints` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FamilyUser` ADD CONSTRAINT `FamilyUser_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `users`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyUser` ADD CONSTRAINT `FamilyUser_idFamily_fkey` FOREIGN KEY (`idFamily`) REFERENCES `Family`(`idFamily`) ON DELETE RESTRICT ON UPDATE CASCADE;
