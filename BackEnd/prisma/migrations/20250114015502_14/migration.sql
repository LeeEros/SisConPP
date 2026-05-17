/*
  Warnings:

  - Made the column `provaPraticaIdProvaPratica` on table `BlocoProva` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "ProvaCampeiraEsportiva" ADD VALUE 'NENHUMA';

-- DropForeignKey
ALTER TABLE "BlocoProva" DROP CONSTRAINT "BlocoProva_provaPraticaIdProvaPratica_fkey";

-- AlterTable
ALTER TABLE "BlocoProva" ALTER COLUMN "provaPraticaIdProvaPratica" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "BlocoProva" ADD CONSTRAINT "BlocoProva_provaPraticaIdProvaPratica_fkey" FOREIGN KEY ("provaPraticaIdProvaPratica") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE RESTRICT ON UPDATE CASCADE;
