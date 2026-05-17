-- CreateTable
CREATE TABLE "ComissaoProvaPratica" (
    "idComissaoProvaPratica" SERIAL NOT NULL,
    "comissaoId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "provaPraticaId" INTEGER NOT NULL,
    "blocoProvaId" INTEGER,
    "dataAtribuicao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComissaoProvaPratica_pkey" PRIMARY KEY ("idComissaoProvaPratica")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComissaoProvaPratica_comissaoId_categoriaId_provaPraticaId__key" ON "ComissaoProvaPratica"("comissaoId", "categoriaId", "provaPraticaId", "blocoProvaId");

-- AddForeignKey
ALTER TABLE "ComissaoProvaPratica" ADD CONSTRAINT "ComissaoProvaPratica_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "Comissao"("idComissao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComissaoProvaPratica" ADD CONSTRAINT "ComissaoProvaPratica_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComissaoProvaPratica" ADD CONSTRAINT "ComissaoProvaPratica_provaPraticaId_fkey" FOREIGN KEY ("provaPraticaId") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComissaoProvaPratica" ADD CONSTRAINT "ComissaoProvaPratica_blocoProvaId_fkey" FOREIGN KEY ("blocoProvaId") REFERENCES "BlocoProva"("idBloco") ON DELETE SET NULL ON UPDATE CASCADE;
