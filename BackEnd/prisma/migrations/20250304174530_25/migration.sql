/*
  Warnings:

  - You are about to drop the column `idProva` on the `ProvaPratica` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Provaid]` on the table `ProvaPratica` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Provaid` to the `ProvaPratica` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProvaPratica" DROP CONSTRAINT "ProvaPratica_idProva_fkey";

-- DropIndex
DROP INDEX "ProvaPratica_idProva_key";

-- AlterTable
ALTER TABLE "ProvaPratica" DROP COLUMN "idProva",
ADD COLUMN     "Provaid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProvaPratica_Provaid_key" ON "ProvaPratica"("Provaid");

-- AddForeignKey
ALTER TABLE "ProvaPratica" ADD CONSTRAINT "ProvaPratica_Provaid_fkey" FOREIGN KEY ("Provaid") REFERENCES "Prova"("idProva") ON DELETE RESTRICT ON UPDATE CASCADE;
