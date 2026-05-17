/*
  Warnings:

  - You are about to drop the column `provaIdProva` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `ProvaPratica` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `ProvaTeorica` table. All the data in the column will be lost.
  - Added the required column `notaMaxima` to the `Prova` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numQuestao` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_provaIdProva_fkey";

-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_provaPraticaId_fkey";

-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_provaTeoricaId_fkey";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "provaIdProva",
ADD COLUMN     "provaId" INTEGER,
ALTER COLUMN "provaTeoricaId" DROP NOT NULL,
ALTER COLUMN "provaPraticaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Prova" ADD COLUMN     "notaMaxima" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ProvaPratica" DROP COLUMN "nome",
ADD COLUMN     "provaId" INTEGER;

-- AlterTable
ALTER TABLE "ProvaTeorica" DROP COLUMN "nome",
ADD COLUMN     "numQuestao" INTEGER NOT NULL,
ADD COLUMN     "provaId" INTEGER;

-- AlterTable
ALTER TABLE "Recurso" ADD COLUMN     "provaIdProva" INTEGER;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("idProva") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_provaTeoricaId_fkey" FOREIGN KEY ("provaTeoricaId") REFERENCES "ProvaTeorica"("idprovaTeorica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_provaPraticaId_fkey" FOREIGN KEY ("provaPraticaId") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvaTeorica" ADD CONSTRAINT "ProvaTeorica_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("idProva") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvaPratica" ADD CONSTRAINT "ProvaPratica_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("idProva") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_provaIdProva_fkey" FOREIGN KEY ("provaIdProva") REFERENCES "Prova"("idProva") ON DELETE SET NULL ON UPDATE CASCADE;
