/*
  Warnings:

  - A unique constraint covering the columns `[candidatoId]` on the table `FichaCandidato` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FichaCandidato_candidatoId_concursoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "FichaCandidato_candidatoId_key" ON "FichaCandidato"("candidatoId");
