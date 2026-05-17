/*
  Warnings:

  - Added the required column `candidatoId` to the `Recurso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recurso" ADD COLUMN     "candidatoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;
