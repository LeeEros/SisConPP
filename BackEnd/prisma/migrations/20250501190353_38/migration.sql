/*
  Warnings:

  - You are about to drop the column `pessoaId` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `cidade` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeCompleto` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numCarteirinha` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numCredenciamento` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Credenciamento" AS ENUM ('CREDENCIADO', 'NAO_CREDENCIADO');

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pessoaId_fkey";

-- DropIndex
DROP INDEX "Usuario_pessoaId_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "pessoaId",
ADD COLUMN     "CTGId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "nomeCompleto" TEXT NOT NULL,
ADD COLUMN     "numCarteirinha" TEXT NOT NULL,
DROP COLUMN "numCredenciamento",
ADD COLUMN     "numCredenciamento" "Credenciamento" NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_CTGId_fkey" FOREIGN KEY ("CTGId") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;
