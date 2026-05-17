/*
  Warnings:

  - You are about to drop the column `pessoaId` on the `CTG` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pessoa" DROP CONSTRAINT "Pessoa_CTGIdCTG_fkey";

-- AlterTable
ALTER TABLE "CTG" DROP COLUMN "pessoaId";

-- AlterTable
ALTER TABLE "Pessoa" ALTER COLUMN "CTGIdCTG" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_CTGIdCTG_fkey" FOREIGN KEY ("CTGIdCTG") REFERENCES "CTG"("idCTG") ON DELETE SET NULL ON UPDATE CASCADE;
