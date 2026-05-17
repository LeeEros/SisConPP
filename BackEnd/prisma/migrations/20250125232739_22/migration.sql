/*
  Warnings:

  - Made the column `concursoId` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_concursoId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "concursoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_concursoId_fkey" FOREIGN KEY ("concursoId") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;
