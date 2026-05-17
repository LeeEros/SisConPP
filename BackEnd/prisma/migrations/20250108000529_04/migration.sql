/*
  Warnings:

  - You are about to drop the column `UsuarioId` on the `ComissaoUsuario` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `ComissaoUsuario` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `funcao` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Funcao" AS ENUM ('SECRETARIO', 'AVAVIADOR', 'AUXILIAR');

-- DropForeignKey
ALTER TABLE "ComissaoUsuario" DROP CONSTRAINT "ComissaoUsuario_UsuarioId_fkey";

-- AlterTable
ALTER TABLE "ComissaoUsuario" DROP COLUMN "UsuarioId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "funcao",
ADD COLUMN     "funcao" "Funcao" NOT NULL;

-- DropEnum
DROP TYPE "funcao";

-- AddForeignKey
ALTER TABLE "ComissaoUsuario" ADD CONSTRAINT "ComissaoUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
