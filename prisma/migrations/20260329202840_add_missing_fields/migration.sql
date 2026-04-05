/*
  Warnings:

  - Added the required column `slug` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SpacedRepetitionCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "quality" INTEGER,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" DATETIME,
    "lastReviewAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SpacedRepetitionCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SpacedRepetitionCard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SpacedRepetitionCard" ("createdAt", "flashcardId", "id", "quality", "userId") SELECT "createdAt", "flashcardId", "id", "quality", "userId" FROM "SpacedRepetitionCard";
DROP TABLE "SpacedRepetitionCard";
ALTER TABLE "new_SpacedRepetitionCard" RENAME TO "SpacedRepetitionCard";
CREATE TABLE "new_Subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Subject" ("createdAt", "id", "title") SELECT "createdAt", "id", "title" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
CREATE UNIQUE INDEX "Subject_slug_key" ON "Subject"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
