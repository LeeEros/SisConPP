-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_concursoId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "comissaoUsuarioId" DROP NOT NULL,
ALTER COLUMN "concursoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_concursoId_fkey" FOREIGN KEY ("concursoId") REFERENCES "Concurso"("idConcurso") ON DELETE SET NULL ON UPDATE CASCADE;
