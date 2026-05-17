/*
  Warnings:

  - You are about to drop the column `candidatoId` on the `Recurso` table. All the data in the column will be lost.
  - Added the required column `arquivos` to the `Recurso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidato` to the `Recurso` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recurso" DROP CONSTRAINT "Recurso_candidatoId_fkey";

-- AlterTable
ALTER TABLE "Recurso" DROP COLUMN "candidatoId",
ADD COLUMN     "arquivos" BYTEA NOT NULL,
ADD COLUMN     "candidato" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_candidato_fkey" FOREIGN KEY ("candidato") REFERENCES "Candidato"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;
