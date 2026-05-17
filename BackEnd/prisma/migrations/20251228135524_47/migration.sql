/*
  Warnings:

  - You are about to drop the column `nota` on the `AvaliacaoQuesito` table. All the data in the column will be lost.
  - You are about to drop the column `nota` on the `AvaliacaoSubQuesito` table. All the data in the column will be lost.
  - Added the required column `notaQuesito` to the `AvaliacaoQuesito` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notaSubQuesito` to the `AvaliacaoSubQuesito` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvaliacaoQuesito" DROP COLUMN "nota",
ADD COLUMN     "notaQuesito" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "AvaliacaoSubQuesito" DROP COLUMN "nota",
ADD COLUMN     "notaSubQuesito" DOUBLE PRECISION NOT NULL;
