/*
  Warnings:

  - You are about to drop the column `provaId` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `provaId` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `provaId` on the `ProvaPratica` table. All the data in the column will be lost.
  - You are about to drop the column `provaId` on the `ProvaTeorica` table. All the data in the column will be lost.
  - You are about to drop the column `provaIdProva` on the `Recurso` table. All the data in the column will be lost.
  - You are about to drop the `Prova` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nomeProva` to the `ProvaPratica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notaMaxima` to the `ProvaPratica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeProva` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notaMaxima` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_provaId_fkey";

-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_provaId_fkey";

-- DropForeignKey
ALTER TABLE "ProvaPratica" DROP CONSTRAINT "ProvaPratica_provaId_fkey";

-- DropForeignKey
ALTER TABLE "ProvaTeorica" DROP CONSTRAINT "ProvaTeorica_provaId_fkey";

-- DropForeignKey
ALTER TABLE "Recurso" DROP CONSTRAINT "Recurso_provaIdProva_fkey";

-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "provaId",
ADD COLUMN     "provaPraticaId" INTEGER,
ADD COLUMN     "provaPraticaIdProvaPratica" INTEGER,
ADD COLUMN     "provaTeoricaId" INTEGER,
ADD COLUMN     "provaTeoricaIdprovaTeorica" INTEGER;

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "provaId";

-- AlterTable
ALTER TABLE "ProvaPratica" DROP COLUMN "provaId",
ADD COLUMN     "nomeProva" TEXT NOT NULL,
ADD COLUMN     "notaMaxima" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ProvaTeorica" DROP COLUMN "provaId",
ADD COLUMN     "nomeProva" TEXT NOT NULL,
ADD COLUMN     "notaMaxima" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Recurso" DROP COLUMN "provaIdProva";

-- DropTable
DROP TABLE "Prova";

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_provaPraticaIdProvaPratica_fkey" FOREIGN KEY ("provaPraticaIdProvaPratica") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_provaTeoricaIdprovaTeorica_fkey" FOREIGN KEY ("provaTeoricaIdprovaTeorica") REFERENCES "ProvaTeorica"("idprovaTeorica") ON DELETE SET NULL ON UPDATE CASCADE;
