/*
  Warnings:

  - Added the required column `anexoGabarito` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gabaritoOficinal` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avaliacao" ADD COLUMN     "fichaCandidadoIdFicha" INTEGER;

-- AlterTable
ALTER TABLE "ProvaTeorica" ADD COLUMN     "anexoGabarito" BYTEA NOT NULL,
ADD COLUMN     "gabaritoOficinal" BYTEA NOT NULL;

-- CreateTable
CREATE TABLE "FichaCandidado" (
    "idFicha" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "notaCandidato" DOUBLE PRECISION NOT NULL,
    "provaId" INTEGER NOT NULL,
    "concursoId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "axenoTermodeCiencia" BYTEA NOT NULL,
    "dataTermo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numAcertosProvaTeorica" INTEGER NOT NULL,
    "anexoGabarito" BYTEA NOT NULL,
    "notaRedacao" DOUBLE PRECISION NOT NULL,
    "anexoRedacao" BYTEA NOT NULL,
    "anexoProvaPratica" BYTEA NOT NULL,

    CONSTRAINT "FichaCandidado_pkey" PRIMARY KEY ("idFicha")
);

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_fichaCandidadoIdFicha_fkey" FOREIGN KEY ("fichaCandidadoIdFicha") REFERENCES "FichaCandidado"("idFicha") ON DELETE SET NULL ON UPDATE CASCADE;
