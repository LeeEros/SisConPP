/*
  Warnings:

  - You are about to drop the column `concursoId` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `pessoaId` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `particiapaoConcursoId` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Pessoa` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cidade` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeCompleto` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numCarteirinha` to the `Candidato` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_concursoId_fkey";

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Pessoa" DROP CONSTRAINT "Pessoa_CTGId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_particiapaoConcursoId_fkey";

-- DropIndex
DROP INDEX "Candidato_pessoaId_key";

-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "concursoId",
DROP COLUMN "pessoaId",
ADD COLUMN     "CTGId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "concursoIdConcurso" INTEGER,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "nomeCompleto" TEXT NOT NULL,
ADD COLUMN     "numCarteirinha" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ParticipacaoConcurso" ADD COLUMN     "candidatoIdCandidato" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "particiapaoConcursoId";

-- DropTable
DROP TABLE "Pessoa";

-- CreateTable
CREATE TABLE "_ParticipacaoConcursoToUsuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ParticipacaoConcursoToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ParticipacaoConcursoToUsuario_B_index" ON "_ParticipacaoConcursoToUsuario"("B");

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_CTGId_fkey" FOREIGN KEY ("CTGId") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_concursoIdConcurso_fkey" FOREIGN KEY ("concursoIdConcurso") REFERENCES "Concurso"("idConcurso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipacaoConcurso" ADD CONSTRAINT "ParticipacaoConcurso_candidatoIdCandidato_fkey" FOREIGN KEY ("candidatoIdCandidato") REFERENCES "Candidato"("idCandidato") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipacaoConcursoToUsuario" ADD CONSTRAINT "_ParticipacaoConcursoToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "ParticipacaoConcurso"("idParticipacaoConcurso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipacaoConcursoToUsuario" ADD CONSTRAINT "_ParticipacaoConcursoToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;
