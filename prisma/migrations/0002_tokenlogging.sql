-- Migration number: 0002 	 2024-04-20T06:46:22.904Z
-- CreateTable
CREATE TABLE "Failure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Failure_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
-- PRAGMA defer_foreign_keys = on
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "params" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Request_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("createdAt", "id", "tokenId") SELECT "createdAt", "id", "tokenId" FROM "Request";
DROP TABLE IF EXISTS "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE TABLE  "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Token" ("createdAt", "id", "isRevoked", "key") SELECT "createdAt", "id", "isRevoked", "key" FROM "Token";
DROP TABLE IF EXISTS "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
