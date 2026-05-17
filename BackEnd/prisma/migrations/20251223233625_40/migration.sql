/*
  Warnings:

  - You are about to drop the column `danca` on the `Quesitos` table. All the data in the column will be lost.
  - You are about to drop the column `dancaSalaoTradicional` on the `Quesitos` table. All the data in the column will be lost.
  - You are about to drop the column `preferenciaSorteioDancaId` on the `Quesitos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quesitos" DROP CONSTRAINT "Quesitos_preferenciaSorteioDancaId_fkey";

-- AlterTable
ALTER TABLE "Quesitos" DROP COLUMN "danca",
DROP COLUMN "dancaSalaoTradicional",
DROP COLUMN "preferenciaSorteioDancaId";

-- CreateTable
CREATE TABLE "Danca" (
    "idDanca" SERIAL NOT NULL,
    "nomeDanca" TEXT NOT NULL,
    "dancaSalaoTradicional" "DancaSalaoTradicional" NOT NULL,
    "preferenciaSorteioDancaIdPreferencia" INTEGER,

    CONSTRAINT "Danca_pkey" PRIMARY KEY ("idDanca")
);

-- CreateTable
CREATE TABLE "_DancaToQuesitos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DancaToQuesitos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DancaToQuesitos_B_index" ON "_DancaToQuesitos"("B");

-- AddForeignKey
ALTER TABLE "Danca" ADD CONSTRAINT "Danca_preferenciaSorteioDancaIdPreferencia_fkey" FOREIGN KEY ("preferenciaSorteioDancaIdPreferencia") REFERENCES "PreferenciaSorteioDanca"("idPreferencia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DancaToQuesitos" ADD CONSTRAINT "_DancaToQuesitos_A_fkey" FOREIGN KEY ("A") REFERENCES "Danca"("idDanca") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DancaToQuesitos" ADD CONSTRAINT "_DancaToQuesitos_B_fkey" FOREIGN KEY ("B") REFERENCES "Quesitos"("idQuesito") ON DELETE CASCADE ON UPDATE CASCADE;
