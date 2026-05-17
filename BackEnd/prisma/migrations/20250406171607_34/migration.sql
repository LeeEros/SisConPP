/*
  Warnings:

  - The primary key for the `PreferenciaSorteioDanca` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idPreferecnia` on the `PreferenciaSorteioDanca` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PreferenciaSorteioDanca" DROP CONSTRAINT "PreferenciaSorteioDanca_pkey",
DROP COLUMN "idPreferecnia",
ADD COLUMN     "idPreferencia" SERIAL NOT NULL,
ADD CONSTRAINT "PreferenciaSorteioDanca_pkey" PRIMARY KEY ("idPreferencia");

-- AlterTable
ALTER TABLE "Quesitos" ADD COLUMN     "preferenciaSorteioDancaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Quesitos" ADD CONSTRAINT "Quesitos_preferenciaSorteioDancaId_fkey" FOREIGN KEY ("preferenciaSorteioDancaId") REFERENCES "PreferenciaSorteioDanca"("idPreferencia") ON DELETE SET NULL ON UPDATE CASCADE;
