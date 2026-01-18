/*
  Warnings:

  - You are about to drop the column `subGrupo` on the `Quesitos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quesitos" DROP COLUMN "subGrupo";

-- AlterTable
ALTER TABLE "SubQuesitos" ADD COLUMN     "subGrupo" "VivenciaSubGrupo";
