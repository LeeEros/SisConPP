/*
  Warnings:

  - You are about to drop the column `nota` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `provaPraticaIdProvaPratica` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `provaTeoricaIdprovaTeorica` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacaoIdAvalicao` on the `Quesitos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_provaPraticaIdProvaPratica_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_provaTeoricaIdprovaTeorica_fkey";

-- DropForeignKey
ALTER TABLE "Quesitos" DROP CONSTRAINT "Quesitos_avaliacaoIdAvalicao_fkey";

-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "nota",
DROP COLUMN "provaPraticaIdProvaPratica",
DROP COLUMN "provaTeoricaIdprovaTeorica",
ADD COLUMN     "notaFinal" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Quesitos" DROP COLUMN "avaliacaoIdAvalicao";

-- CreateTable
CREATE TABLE "AvaliacaoQuesito" (
    "idAvaliacaoQuesito" SERIAL NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT,
    "avaliacaoId" INTEGER NOT NULL,
    "quesitoId" INTEGER NOT NULL,

    CONSTRAINT "AvaliacaoQuesito_pkey" PRIMARY KEY ("idAvaliacaoQuesito")
);

-- CreateTable
CREATE TABLE "AvaliacaoSubQuesito" (
    "idAvaliacaoSubQuesito" SERIAL NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "subQuesitoId" INTEGER NOT NULL,
    "avaliacaoQuesitoId" INTEGER,

    CONSTRAINT "AvaliacaoSubQuesito_pkey" PRIMARY KEY ("idAvaliacaoSubQuesito")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvaliacaoQuesito_avaliacaoId_quesitoId_key" ON "AvaliacaoQuesito"("avaliacaoId", "quesitoId");

-- CreateIndex
CREATE UNIQUE INDEX "AvaliacaoSubQuesito_avaliacaoQuesitoId_subQuesitoId_key" ON "AvaliacaoSubQuesito"("avaliacaoQuesitoId", "subQuesitoId");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_provaPraticaId_fkey" FOREIGN KEY ("provaPraticaId") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_provaTeoricaId_fkey" FOREIGN KEY ("provaTeoricaId") REFERENCES "ProvaTeorica"("idprovaTeorica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoQuesito" ADD CONSTRAINT "AvaliacaoQuesito_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "Avaliacao"("idAvalicao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoQuesito" ADD CONSTRAINT "AvaliacaoQuesito_quesitoId_fkey" FOREIGN KEY ("quesitoId") REFERENCES "Quesitos"("idQuesito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoSubQuesito" ADD CONSTRAINT "AvaliacaoSubQuesito_subQuesitoId_fkey" FOREIGN KEY ("subQuesitoId") REFERENCES "SubQuesitos"("idSubequestios") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoSubQuesito" ADD CONSTRAINT "AvaliacaoSubQuesito_avaliacaoQuesitoId_fkey" FOREIGN KEY ("avaliacaoQuesitoId") REFERENCES "AvaliacaoQuesito"("idAvaliacaoQuesito") ON DELETE SET NULL ON UPDATE CASCADE;
