/*
  Warnings:

  - You are about to drop the `Avalicao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avalicao" DROP CONSTRAINT "Avalicao_avaliadorId_fkey";

-- DropForeignKey
ALTER TABLE "Avalicao" DROP CONSTRAINT "Avalicao_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "Avalicao" DROP CONSTRAINT "Avalicao_comissaoId_fkey";

-- DropTable
DROP TABLE "Avalicao";

-- CreateTable
CREATE TABLE "Avaliacao" (
    "idAvalicao" SERIAL NOT NULL,
    "dataAvaliacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comissaoId" INTEGER NOT NULL,
    "avaliadorId" INTEGER NOT NULL,
    "candidatoId" INTEGER NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("idAvalicao")
);

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "Comissao"("idComissao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;
