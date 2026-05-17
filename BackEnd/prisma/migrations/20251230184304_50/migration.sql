-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_comissaoId_fkey";

-- AlterTable
ALTER TABLE "Avaliacao" ALTER COLUMN "comissaoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "Comissao"("idComissao") ON DELETE SET NULL ON UPDATE CASCADE;
