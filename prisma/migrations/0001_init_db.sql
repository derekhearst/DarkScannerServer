-- Migration number: 0001 	 2024-04-20T00:02:49.289Z

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Enchantment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ItemPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemPrice_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EnchantmentToItemPrice" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EnchantmentToItemPrice_A_fkey" FOREIGN KEY ("A") REFERENCES "Enchantment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EnchantmentToItemPrice_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemPrice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Enchantment_name_key" ON "Enchantment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EnchantmentToItemPrice_AB_unique" ON "_EnchantmentToItemPrice"("A", "B");

-- CreateIndex
CREATE INDEX "_EnchantmentToItemPrice_B_index" ON "_EnchantmentToItemPrice"("B");
