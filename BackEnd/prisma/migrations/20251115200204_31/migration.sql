/*
  Warnings:

  - The `numCredenciamento` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ParticipacaoConcurso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParticipacaoConcursoToUsuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[comissaoId,usuarioId]` on the table `ComissaoUsuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ParticipacaoConcurso" DROP CONSTRAINT "ParticipacaoConcurso_candidatoIdCandidato_fkey";

-- DropForeignKey
ALTER TABLE "ParticipacaoConcurso" DROP CONSTRAINT "ParticipacaoConcurso_concursoId_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipacaoConcursoToUsuario" DROP CONSTRAINT "_ParticipacaoConcursoToUsuario_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipacaoConcursoToUsuario" DROP CONSTRAINT "_ParticipacaoConcursoToUsuario_B_fkey";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "credenciamento" "Credenciamento" NOT NULL DEFAULT 'NAO_CREDENCIADO',
DROP COLUMN "numCredenciamento",
ADD COLUMN     "numCredenciamento" TEXT;

-- DropTable
DROP TABLE "ParticipacaoConcurso";

-- DropTable
DROP TABLE "_ParticipacaoConcursoToUsuario";

-- CreateIndex
CREATE UNIQUE INDEX "ComissaoUsuario_comissaoId_usuarioId_key" ON "ComissaoUsuario"("comissaoId", "usuarioId");
