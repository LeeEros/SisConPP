/*
  Warnings:

  - You are about to drop the column `fichaCandidadoIdFicha` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the `FichaCandidado` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provaId` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDanca` to the `SorteioDanca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_fichaCandidadoIdFicha_fkey";

-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "fichaCandidadoIdFicha",
ADD COLUMN     "blocoProvaId" INTEGER,
ADD COLUMN     "fichaCandidatoIdFicha" INTEGER,
ADD COLUMN     "provaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SorteioDanca" ADD COLUMN     "tipoDanca" "DancaSalaoTradicional" NOT NULL;

-- DropTable
DROP TABLE "FichaCandidado";

-- CreateTable
CREATE TABLE "FichaCandidato" (
    "idFicha" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "notaCandidato" DOUBLE PRECISION NOT NULL,
    "provaId" INTEGER NOT NULL,
    "concursoId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "anexoTermodeCiencia" BYTEA NOT NULL,
    "dataTermo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numAcertosProvaTeorica" INTEGER NOT NULL,
    "anexoGabarito" BYTEA NOT NULL,
    "notaRedacao" DOUBLE PRECISION NOT NULL,
    "anexoRedacao" BYTEA NOT NULL,
    "anexoProvaPratica" BYTEA NOT NULL,

    CONSTRAINT "FichaCandidato_pkey" PRIMARY KEY ("idFicha")
);

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("idProva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_blocoProvaId_fkey" FOREIGN KEY ("blocoProvaId") REFERENCES "BlocoProva"("idBloco") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_fichaCandidatoIdFicha_fkey" FOREIGN KEY ("fichaCandidatoIdFicha") REFERENCES "FichaCandidato"("idFicha") ON DELETE SET NULL ON UPDATE CASCADE;
