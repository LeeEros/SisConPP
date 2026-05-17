/*
  Warnings:

  - You are about to drop the column `CTGId` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `CTGId` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_CTGId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_CTGId_fkey";

-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "CTGId";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "CTGId";
