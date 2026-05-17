/*
  Warnings:

  - You are about to drop the column `filiacao` on the `Candidato` table. All the data in the column will be lost.
  - Added the required column `filiacaoMae` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filiacaoPai` to the `Candidato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "filiacao",
ADD COLUMN     "anexoFoto" BYTEA,
ADD COLUMN     "filiacaoMae" TEXT NOT NULL,
ADD COLUMN     "filiacaoPai" TEXT NOT NULL;
