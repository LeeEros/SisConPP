-- AlterTable
ALTER TABLE "Quesitos" ADD COLUMN     "provaTeoricaIdprovaTeorica" INTEGER;

-- AddForeignKey
ALTER TABLE "Quesitos" ADD CONSTRAINT "Quesitos_provaTeoricaIdprovaTeorica_fkey" FOREIGN KEY ("provaTeoricaIdprovaTeorica") REFERENCES "ProvaTeorica"("idprovaTeorica") ON DELETE SET NULL ON UPDATE CASCADE;
