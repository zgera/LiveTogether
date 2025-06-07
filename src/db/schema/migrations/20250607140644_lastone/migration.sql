-- CreateTable
CREATE TABLE `Invitation` (
    `idInvitation` VARCHAR(191) NOT NULL,
    `idFamily` VARCHAR(191) NOT NULL,
    `idUserInvited` VARCHAR(191) NOT NULL,
    `idUserInviter` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idInvitation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_idUserInvited_fkey` FOREIGN KEY (`idUserInvited`) REFERENCES `users`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_idUserInviter_fkey` FOREIGN KEY (`idUserInviter`) REFERENCES `users`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_idFamily_fkey` FOREIGN KEY (`idFamily`) REFERENCES `Family`(`idFamily`) ON DELETE RESTRICT ON UPDATE CASCADE;
