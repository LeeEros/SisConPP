/*
  Warnings:

  - You are about to drop the column `provaPraticaIdProvaPratica` on the `BlocoProva` table. All the data in the column will be lost.
  - You are about to drop the column `cTGIdCTG` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `CTGIdCTG` on the `Pessoa` table. All the data in the column will be lost.
  - You are about to drop the column `sorteioDancaIdSorteio` on the `PreferenciaSorteioDanca` table. All the data in the column will be lost.
  - You are about to drop the column `idProva` on the `ProvaTeorica` table. All the data in the column will be lost.
  - You are about to drop the column `UsuarioId` on the `SorteioDanca` table. All the data in the column will be lost.
  - You are about to drop the column `ComissaoUsuarioId` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `concursoIdConcurso` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `provaPraticaId` to the `BlocoProva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CTGId` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provaId` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `SorteioDanca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comissaoUsuarioId` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `concursoId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlocoProva" DROP CONSTRAINT "BlocoProva_provaPraticaIdProvaPratica_fkey";

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_cTGIdCTG_fkey";

-- DropForeignKey
ALTER TABLE "Pessoa" DROP CONSTRAINT "Pessoa_CTGIdCTG_fkey";

-- DropForeignKey
ALTER TABLE "PreferenciaSorteioDanca" DROP CONSTRAINT "PreferenciaSorteioDanca_sorteioDancaIdSorteio_fkey";

-- DropForeignKey
ALTER TABLE "ProvaTeorica" DROP CONSTRAINT "ProvaTeorica_idProva_fkey";

-- DropForeignKey
ALTER TABLE "SorteioDanca" DROP CONSTRAINT "SorteioDanca_UsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_concursoIdConcurso_fkey";

-- AlterTable
ALTER TABLE "BlocoProva" DROP COLUMN "provaPraticaIdProvaPratica",
ADD COLUMN     "provaPraticaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "cTGIdCTG",
ADD COLUMN     "CTGId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pessoa" DROP COLUMN "CTGIdCTG",
ADD COLUMN     "CTGId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PreferenciaSorteioDanca" DROP COLUMN "sorteioDancaIdSorteio",
ADD COLUMN     "sorteioDancaId" INTEGER;

-- AlterTable
ALTER TABLE "ProvaTeorica" DROP COLUMN "idProva",
ADD COLUMN     "provaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SorteioDanca" DROP COLUMN "UsuarioId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "ComissaoUsuarioId",
DROP COLUMN "concursoIdConcurso",
ADD COLUMN     "comissaoUsuarioId" INTEGER NOT NULL,
ADD COLUMN     "concursoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_CTGId_fkey" FOREIGN KEY ("CTGId") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_CTGId_fkey" FOREIGN KEY ("CTGId") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_concursoId_fkey" FOREIGN KEY ("concursoId") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenciaSorteioDanca" ADD CONSTRAINT "PreferenciaSorteioDanca_sorteioDancaId_fkey" FOREIGN KEY ("sorteioDancaId") REFERENCES "SorteioDanca"("idSorteio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvaTeorica" ADD CONSTRAINT "ProvaTeorica_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("idProva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlocoProva" ADD CONSTRAINT "BlocoProva_provaPraticaId_fkey" FOREIGN KEY ("provaPraticaId") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteioDanca" ADD CONSTRAINT "SorteioDanca_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
