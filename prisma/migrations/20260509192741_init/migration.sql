-- CreateTable
CREATE TABLE "LocalProperty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "rooms" INTEGER NOT NULL DEFAULT 0,
    "area" REAL NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "isSynced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
