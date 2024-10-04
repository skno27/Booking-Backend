/*
  Warnings:

  - You are about to drop the column `orderTotal` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderTotal` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderTotal";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "orderTotal" DECIMAL(65,30) NOT NULL;
