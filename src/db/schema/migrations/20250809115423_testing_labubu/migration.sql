-- CreateTable
CREATE TABLE "Difficulty" (
    "idDifficulty" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Family" (
    "idFamily" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FamilyUser" (
    "idFamilyUser" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL,
    "idFamily" TEXT NOT NULL,
    "idRole" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    CONSTRAINT "FamilyUser_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FamilyUser_idFamily_fkey" FOREIGN KEY ("idFamily") REFERENCES "Family" ("idFamily") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FamilyUser_idRole_fkey" FOREIGN KEY ("idRole") REFERENCES "Role" ("idRole") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invitation" (
    "idInvitation" TEXT NOT NULL PRIMARY KEY,
    "idFamily" TEXT NOT NULL,
    "idUserInvited" TEXT NOT NULL,
    "idUserInviter" TEXT NOT NULL,
    "accepted" BOOLEAN,
    CONSTRAINT "Invitation_idUserInvited_fkey" FOREIGN KEY ("idUserInvited") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invitation_idUserInviter_fkey" FOREIGN KEY ("idUserInviter") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invitation_idFamily_fkey" FOREIGN KEY ("idFamily") REFERENCES "Family" ("idFamily") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "idNote" TEXT NOT NULL PRIMARY KEY,
    "familyId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    CONSTRAINT "Note_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Note_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("idFamily") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "idRole" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
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
    CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "users" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_idDifficulty_fkey" FOREIGN KEY ("idDifficulty") REFERENCES "Difficulty" ("idDifficulty") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("idFamily") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "idUser" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
