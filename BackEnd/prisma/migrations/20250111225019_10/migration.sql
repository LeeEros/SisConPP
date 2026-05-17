/*
  Warnings:

  - You are about to drop the column `categoriaIdCategoria` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `concursoIdConcurso` on the `Candidato` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `concursoId` to the `Candidato` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_categoriaIdCategoria_fkey";

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_concursoIdConcurso_fkey";

-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "categoriaIdCategoria",
DROP COLUMN "concursoIdConcurso",
ADD COLUMN     "categoriaId" INTEGER NOT NULL,
ADD COLUMN     "concursoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_concursoId_fkey" FOREIGN KEY ("concursoId") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;
