/*
  Warnings:

  - Added the required column `nota` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avaliacao" ADD COLUMN     "nota" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Quesitos" ADD COLUMN     "avaliacaoIdAvalicao" INTEGER;

-- AddForeignKey
ALTER TABLE "Quesitos" ADD CONSTRAINT "Quesitos_avaliacaoIdAvalicao_fkey" FOREIGN KEY ("avaliacaoIdAvalicao") REFERENCES "Avaliacao"("idAvalicao") ON DELETE SET NULL ON UPDATE CASCADE;
