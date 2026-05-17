/*
  Warnings:

  - You are about to drop the column `notaRedacao` on the `FichaCandidato` table. All the data in the column will be lost.
  - You are about to drop the column `numAcertosProvaTeorica` on the `FichaCandidato` table. All the data in the column will be lost.
  - Added the required column `notaFinalProvaTeorica` to the `FichaCandidato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FichaCandidato" DROP COLUMN "notaRedacao",
DROP COLUMN "numAcertosProvaTeorica",
ADD COLUMN     "notaFinalProvaTeorica" DOUBLE PRECISION NOT NULL;
