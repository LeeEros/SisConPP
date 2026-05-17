-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "provaIdProva" INTEGER;

-- CreateTable
CREATE TABLE "Prova" (
    "idProva" SERIAL NOT NULL,
    "nomeProva" TEXT NOT NULL,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("idProva")
);

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_provaIdProva_fkey" FOREIGN KEY ("provaIdProva") REFERENCES "Prova"("idProva") ON DELETE SET NULL ON UPDATE CASCADE;
