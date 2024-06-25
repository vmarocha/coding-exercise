/*
  Warnings:

  - You are about to drop the column `received_date` on the `goods_receipt` table. All the data in the column will be lost.
  - Added the required column `received_at` to the `goods_receipt` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_goods_receipt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "purchase_order_id" INTEGER NOT NULL,
    "received_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "goods_receipt_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_goods_receipt" ("created_at", "id", "purchase_order_id", "updated_at") SELECT "created_at", "id", "purchase_order_id", "updated_at" FROM "goods_receipt";
DROP TABLE "goods_receipt";
ALTER TABLE "new_goods_receipt" RENAME TO "goods_receipt";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
