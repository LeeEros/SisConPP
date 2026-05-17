/*
  Warnings:

  - The `status` column on the `Recurso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `avaliacaoId` to the `Recurso` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusRecurso" AS ENUM ('PENDENTE', 'DEFERIDO', 'INDEFERIDO');

-- AlterTable
ALTER TABLE "Recurso" ADD COLUMN     "avaliacaoId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusRecurso" NOT NULL DEFAULT 'PENDENTE';

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "Avaliacao"("idAvalicao") ON DELETE RESTRICT ON UPDATE CASCADE;
