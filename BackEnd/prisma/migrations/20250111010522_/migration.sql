/*
  Warnings:

  - A unique constraint covering the columns `[CTGIdCTG]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anexoCarteirinha` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anexoEscolaridade` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anexoResidencia` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anexoTermoCanditado` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fichaInscricao` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CTGIdCTG` to the `Pessoa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CTG" DROP CONSTRAINT "CTG_pessoaId_fkey";

-- AlterTable
ALTER TABLE "Candidato" ADD COLUMN     "anaexoProvaEsportivaCamepira" BYTEA,
ADD COLUMN     "anaexoResponsavel" BYTEA,
ADD COLUMN     "anexenoAtaConcurso" BYTEA,
ADD COLUMN     "anexoCarteirinha" BYTEA NOT NULL,
ADD COLUMN     "anexoEscolaridade" BYTEA NOT NULL,
ADD COLUMN     "anexoRelatorioVivencia" BYTEA,
ADD COLUMN     "anexoResidencia" BYTEA NOT NULL,
ADD COLUMN     "anexoTermoCanditado" BYTEA NOT NULL,
ADD COLUMN     "fichaInscricao" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "CTGIdCTG" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_CTGIdCTG_key" ON "Pessoa"("CTGIdCTG");

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_CTGIdCTG_fkey" FOREIGN KEY ("CTGIdCTG") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;
