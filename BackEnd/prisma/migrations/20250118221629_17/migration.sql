/*
  Warnings:

  - You are about to drop the column `cTGIdCTG` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `CTGId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_cTGIdCTG_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "cTGIdCTG",
ADD COLUMN     "CTGId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_CTGId_fkey" FOREIGN KEY ("CTGId") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;
