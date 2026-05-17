-- DropForeignKey
ALTER TABLE "ComissaoProvaPratica" DROP CONSTRAINT "ComissaoProvaPratica_provaPraticaId_fkey";

-- AlterTable
ALTER TABLE "ComissaoProvaPratica" ALTER COLUMN "provaPraticaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ComissaoProvaPratica" ADD CONSTRAINT "ComissaoProvaPratica_provaPraticaId_fkey" FOREIGN KEY ("provaPraticaId") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE SET NULL ON UPDATE CASCADE;
