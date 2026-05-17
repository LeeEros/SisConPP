/*
  Warnings:

  - You are about to drop the `_DancaToQuesitos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quesitoId` to the `Danca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DancaToQuesitos" DROP CONSTRAINT "_DancaToQuesitos_A_fkey";

-- DropForeignKey
ALTER TABLE "_DancaToQuesitos" DROP CONSTRAINT "_DancaToQuesitos_B_fkey";

-- AlterTable
ALTER TABLE "Danca" ADD COLUMN     "quesitoId" INTEGER NOT NULL,
ADD COLUMN     "quesitosIdQuesito" INTEGER;

-- DropTable
DROP TABLE "_DancaToQuesitos";

-- AddForeignKey
ALTER TABLE "Danca" ADD CONSTRAINT "Danca_quesitosIdQuesito_fkey" FOREIGN KEY ("quesitosIdQuesito") REFERENCES "Quesitos"("idQuesito") ON DELETE SET NULL ON UPDATE CASCADE;
