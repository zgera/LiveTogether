-- CreateTable
CREATE TABLE "Notification" (
    "idNotification" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL,
    "idFamily" TEXT NOT NULL,
    "taskCreated" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "idTask" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seen" BOOLEAN NOT NULL DEFAULT false
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invitation" (
    "idInvitation" TEXT NOT NULL PRIMARY KEY,
    "idFamily" TEXT NOT NULL,
    "idUserInvited" TEXT NOT NULL,
    "idUserInviter" TEXT NOT NULL,
    "accepted" BOOLEAN,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Invitation_idUserInvited_fkey" FOREIGN KEY ("idUserInvited") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invitation_idUserInviter_fkey" FOREIGN KEY ("idUserInviter") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invitation_idFamily_fkey" FOREIGN KEY ("idFamily") REFERENCES "Family" ("idFamily") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invitation" ("accepted", "idFamily", "idInvitation", "idUserInvited", "idUserInviter") SELECT "accepted", "idFamily", "idInvitation", "idUserInvited", "idUserInviter" FROM "Invitation";
DROP TABLE "Invitation";
ALTER TABLE "new_Invitation" RENAME TO "Invitation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
