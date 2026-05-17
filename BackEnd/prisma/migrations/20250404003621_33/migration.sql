-- DropForeignKey
ALTER TABLE "BlocoProva" DROP CONSTRAINT "BlocoProva_provaPraticaId_fkey";

-- AlterTable
ALTER TABLE "BlocoProva" ALTER COLUMN "provaPraticaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BlocoProva" ADD CONSTRAINT "BlocoProva_provaPraticaId_fkey" FOREIGN KEY ("provaPraticaId") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE SET NULL ON UPDATE CASCADE;
