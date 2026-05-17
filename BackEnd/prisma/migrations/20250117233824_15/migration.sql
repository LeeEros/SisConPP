/*
  Warnings:

  - The values [AVAVIADOR] on the enum `Funcao` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `ComissaoUsuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ComissaoUsuario` table. All the data in the column will be lost.
  - You are about to drop the column `comissaoIdComissao` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `ComissaoUsuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ComissaoUsuarioId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Funcao_new" AS ENUM ('SECRETARIO', 'AVALIADOR', 'AUXILIAR');
ALTER TABLE "Usuario" ALTER COLUMN "funcao" TYPE "Funcao_new" USING ("funcao"::text::"Funcao_new");
ALTER TYPE "Funcao" RENAME TO "Funcao_old";
ALTER TYPE "Funcao_new" RENAME TO "Funcao";
DROP TYPE "Funcao_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_comissaoIdComissao_fkey";

-- AlterTable
ALTER TABLE "ComissaoUsuario" DROP CONSTRAINT "ComissaoUsuario_pkey",
DROP COLUMN "id",
ADD COLUMN     "idComissaoUsuario" SERIAL NOT NULL,
ADD CONSTRAINT "ComissaoUsuario_pkey" PRIMARY KEY ("idComissaoUsuario");

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "comissaoIdComissao",
ADD COLUMN     "ComissaoUsuarioId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ComissaoUsuario_usuarioId_key" ON "ComissaoUsuario"("usuarioId");
