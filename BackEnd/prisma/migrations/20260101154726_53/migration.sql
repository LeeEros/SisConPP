-- AddForeignKey
ALTER TABLE "FichaCandidato" ADD CONSTRAINT "FichaCandidato_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaCandidato" ADD CONSTRAINT "FichaCandidato_concursoId_fkey" FOREIGN KEY ("concursoId") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;
