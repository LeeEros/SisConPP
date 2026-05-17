/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `FichaCandidato` table. All the data in the column will be lost.
  - You are about to drop the column `provaId` on the `FichaCandidato` table. All the data in the column will be lost.
  - Added the required column `notaFinalProvasPraticas` to the `FichaCandidato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FichaCandidato" DROP COLUMN "categoriaId",
DROP COLUMN "provaId",
ADD COLUMN     "notaFinalProvasPraticas" DOUBLE PRECISION NOT NULL;
