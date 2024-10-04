/*
  Warnings:

  - You are about to alter the column `orderTotal` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "orderTotal" SET DEFAULT 0.00,
ALTER COLUMN "orderTotal" SET DATA TYPE DECIMAL(10,2);
