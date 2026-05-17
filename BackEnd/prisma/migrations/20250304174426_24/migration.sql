/*
  Warnings:

  - You are about to drop the column `tipo` on the `Prova` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idProva]` on the table `ProvaPratica` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provaId]` on the table `ProvaTeorica` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Prova" DROP COLUMN "tipo";

-- AlterTable
ALTER TABLE "Quesitos" ADD COLUMN     "blocoProvaIdBloco" INTEGER;

-- DropEnum
DROP TYPE "TipoProva";

-- CreateIndex
CREATE UNIQUE INDEX "ProvaPratica_idProva_key" ON "ProvaPratica"("idProva");

-- CreateIndex
CREATE UNIQUE INDEX "ProvaTeorica_provaId_key" ON "ProvaTeorica"("provaId");

-- AddForeignKey
ALTER TABLE "Quesitos" ADD CONSTRAINT "Quesitos_blocoProvaIdBloco_fkey" FOREIGN KEY ("blocoProvaIdBloco") REFERENCES "BlocoProva"("idBloco") ON DELETE SET NULL ON UPDATE CASCADE;
