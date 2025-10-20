/*
  Warnings:

  - You are about to drop the column `taskCreated` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "idNotification" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL,
    "idFamily" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "idTask" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seen" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Notification" ("createdAt", "idFamily", "idNotification", "idTask", "idUser", "seen", "title") SELECT "createdAt", "idFamily", "idNotification", "idTask", "idUser", "seen", "title" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
CREATE TABLE "new_Task" (
    "idTask" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completedByUser" BOOLEAN NOT NULL,
    "completedByAdmin" BOOLEAN NOT NULL,
    "familyId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "assignedId" TEXT,
    "idDifficulty" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" DATETIME NOT NULL,
    "penalized" BOOLEAN NOT NULL DEFAULT false,
    "notifiedDeadlineSoon" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "users" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_idDifficulty_fkey" FOREIGN KEY ("idDifficulty") REFERENCES "Difficulty" ("idDifficulty") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("idFamily") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("assignedId", "completedByAdmin", "completedByUser", "createdAt", "creatorId", "description", "familyId", "idDifficulty", "idTask", "name") SELECT "assignedId", "completedByAdmin", "completedByUser", "createdAt", "creatorId", "description", "familyId", "idDifficulty", "idTask", "name" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
