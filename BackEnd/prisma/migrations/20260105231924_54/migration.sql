/*
  Warnings:

  - You are about to drop the column `quesitoId` on the `Danca` table. All the data in the column will be lost.
  - You are about to drop the column `quesitosIdQuesito` on the `Danca` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Danca" DROP CONSTRAINT "Danca_quesitosIdQuesito_fkey";

-- AlterTable
ALTER TABLE "Danca" DROP COLUMN "quesitoId",
DROP COLUMN "quesitosIdQuesito";
