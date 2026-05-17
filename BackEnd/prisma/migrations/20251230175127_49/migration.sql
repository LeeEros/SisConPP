/*
  Warnings:

  - A unique constraint covering the columns `[candidatoId,concursoId]` on the table `FichaCandidato` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FichaCandidato_candidatoId_concursoId_key" ON "FichaCandidato"("candidatoId", "concursoId");
