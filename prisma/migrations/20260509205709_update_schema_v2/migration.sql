-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LocalProperty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "rooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "area" REAL NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "description" TEXT,
    "type" TEXT DEFAULT 'وحدة سكنية',
    "isSynced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LocalProperty" ("area", "createdAt", "id", "image_url", "isSynced", "location", "price", "rooms", "title", "updatedAt") SELECT "area", "createdAt", "id", "image_url", "isSynced", "location", "price", "rooms", "title", "updatedAt" FROM "LocalProperty";
DROP TABLE "LocalProperty";
ALTER TABLE "new_LocalProperty" RENAME TO "LocalProperty";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
