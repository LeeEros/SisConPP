/*
  Warnings:

  - You are about to drop the column `concursoId` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_concursoId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "concursoId",
ADD COLUMN     "particiapaoConcursoId" INTEGER;

-- CreateTable
CREATE TABLE "ParticipacaoConcurso" (
    "idParticipacaoConcurso" SERIAL NOT NULL,
    "concursoId" INTEGER NOT NULL,

    CONSTRAINT "ParticipacaoConcurso_pkey" PRIMARY KEY ("idParticipacaoConcurso")
);

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_particiapaoConcursoId_fkey" FOREIGN KEY ("particiapaoConcursoId") REFERENCES "ParticipacaoConcurso"("idParticipacaoConcurso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipacaoConcurso" ADD CONSTRAINT "ParticipacaoConcurso_concursoId_fkey" FOREIGN KEY ("concursoId") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;
