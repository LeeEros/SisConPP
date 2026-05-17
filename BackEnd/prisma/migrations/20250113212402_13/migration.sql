/*
  Warnings:

  - Made the column `CTGIdCTG` on table `Pessoa` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Pessoa" DROP CONSTRAINT "Pessoa_CTGIdCTG_fkey";

-- DropIndex
DROP INDEX "Pessoa_CTGIdCTG_key";

-- AlterTable
ALTER TABLE "Pessoa" ALTER COLUMN "CTGIdCTG" SET NOT NULL,
ALTER COLUMN "CTGIdCTG" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_CTGIdCTG_fkey" FOREIGN KEY ("CTGIdCTG") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;
