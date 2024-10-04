/*
  Warnings:

  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Mix` table. All the data in the column will be lost.
  - Added the required column `songName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songName` to the `Mix` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "name",
ADD COLUMN     "personName" TEXT;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
ADD COLUMN     "songName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mix" DROP COLUMN "name",
ADD COLUMN     "songName" TEXT NOT NULL;
