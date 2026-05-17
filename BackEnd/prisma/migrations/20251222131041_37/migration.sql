/*
  Warnings:

  - You are about to drop the column `gabaritoOficinal` on the `ProvaTeorica` table. All the data in the column will be lost.
  - Added the required column `gabaritoOficial` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProvaTeorica" DROP COLUMN "gabaritoOficinal",
ADD COLUMN     "gabaritoOficial" BYTEA NOT NULL;
