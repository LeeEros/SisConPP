-- DropForeignKey
ALTER TABLE "ComissaoProvaPratica" DROP CONSTRAINT "ComissaoProvaPratica_categoriaId_fkey";

-- AlterTable
ALTER TABLE "ComissaoProvaPratica" ALTER COLUMN "categoriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ComissaoProvaPratica" ADD CONSTRAINT "ComissaoProvaPratica_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("idCategoria") ON DELETE SET NULL ON UPDATE CASCADE;
