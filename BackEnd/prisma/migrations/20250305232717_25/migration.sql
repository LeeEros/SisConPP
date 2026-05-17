/*
  Warnings:

  - You are about to drop the column `Provaid` on the `ProvaPratica` table. All the data in the column will be lost.
  - You are about to drop the column `provaId` on the `ProvaTeorica` table. All the data in the column will be lost.
  - You are about to drop the column `provaIdProva` on the `Recurso` table. All the data in the column will be lost.
  - You are about to drop the `Prova` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProvaPratica" DROP CONSTRAINT "ProvaPratica_Provaid_fkey";

-- DropForeignKey
ALTER TABLE "ProvaTeorica" DROP CONSTRAINT "ProvaTeorica_provaId_fkey";

-- DropForeignKey
ALTER TABLE "Recurso" DROP CONSTRAINT "Recurso_provaIdProva_fkey";

-- DropIndex
DROP INDEX "ProvaPratica_Provaid_key";

-- DropIndex
DROP INDEX "ProvaTeorica_provaId_key";

-- AlterTable
ALTER TABLE "ProvaPratica" DROP COLUMN "Provaid";

-- AlterTable
ALTER TABLE "ProvaTeorica" DROP COLUMN "provaId";

-- AlterTable
ALTER TABLE "Recurso" DROP COLUMN "provaIdProva",
ADD COLUMN     "provaPraticaIdProvaPratica" INTEGER,
ADD COLUMN     "provaTeoricaIdprovaTeorica" INTEGER;

-- DropTable
DROP TABLE "Prova";

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_provaTeoricaIdprovaTeorica_fkey" FOREIGN KEY ("provaTeoricaIdprovaTeorica") REFERENCES "ProvaTeorica"("idprovaTeorica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_provaPraticaIdProvaPratica_fkey" FOREIGN KEY ("provaPraticaIdProvaPratica") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE SET NULL ON UPDATE CASCADE;
