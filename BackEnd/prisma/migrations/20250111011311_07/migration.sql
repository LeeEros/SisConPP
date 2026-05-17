/*
  Warnings:

  - You are about to drop the column `anaexoProvaEsportivaCamepira` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anaexoResponsavel` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexenoAtaConcurso` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoTermoCanditado` on the `Candidato` table. All the data in the column will be lost.
  - Added the required column `anexoTermoCandidato` to the `Candidato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "anaexoProvaEsportivaCamepira",
DROP COLUMN "anaexoResponsavel",
DROP COLUMN "anexenoAtaConcurso",
DROP COLUMN "anexoTermoCanditado",
ADD COLUMN     "anexoAtaConcurso" BYTEA,
ADD COLUMN     "anexoProvaEsportivaCampeira" BYTEA,
ADD COLUMN     "anexoResponsavel" BYTEA,
ADD COLUMN     "anexoTermoCandidato" BYTEA NOT NULL;
