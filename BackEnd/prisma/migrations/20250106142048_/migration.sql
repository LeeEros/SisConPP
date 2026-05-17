/*
  Warnings:

  - You are about to drop the column `anexoAtaConcurso` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoCarteirinha` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoEscolaridade` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoProvaEsportivaCampeira` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoRelatorioVivencia` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoResidencia` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoResponsável` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoTermoCandidato` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `anexoTermoEntidade` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `ctgCanditadoId` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `fichaInscricao` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `nomeCompleto` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `numCarteirinha` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `provaCampeiraEsportiva` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `nomeProva` on the `ProvaPratica` table. All the data in the column will be lost.
  - The primary key for the `ProvaTeorica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idProvaTeorica` on the `ProvaTeorica` table. All the data in the column will be lost.
  - You are about to drop the column `nomeProva` on the `ProvaTeorica` table. All the data in the column will be lost.
  - You are about to drop the column `CTGUsuario` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `nomeCompleto` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `numCarteirinha` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pessoaId]` on the table `Candidato` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idProva]` on the table `ProvaPratica` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idProva]` on the table `ProvaTeorica` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pessoaId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cTGIdCTG` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoriaIdCategoria` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pessoaId` to the `Candidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idProva` to the `ProvaPratica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `ProvaPratica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idProva` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `ProvaTeorica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cTGIdCTG` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pessoaId` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `funcao` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "funcao" AS ENUM ('SECRETARIO', 'AVAVIADOR', 'AUXILIAR');

-- CreateEnum
CREATE TYPE "TipoProva" AS ENUM ('PRATICA', 'TEORICA');

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_ctgCanditadoId_fkey";

-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_provaTeoricaId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_CTGUsuario_fkey";

-- DropIndex
DROP INDEX "Candidato_CPF_key";

-- DropIndex
DROP INDEX "Candidato_numCarteirinha_key";

-- DropIndex
DROP INDEX "Usuario_numCarteirinha_key";

-- AlterTable
ALTER TABLE "CTG" ADD COLUMN     "pessoaId" INTEGER;

-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "anexoAtaConcurso",
DROP COLUMN "anexoCarteirinha",
DROP COLUMN "anexoEscolaridade",
DROP COLUMN "anexoProvaEsportivaCampeira",
DROP COLUMN "anexoRelatorioVivencia",
DROP COLUMN "anexoResidencia",
DROP COLUMN "anexoResponsável",
DROP COLUMN "anexoTermoCandidato",
DROP COLUMN "anexoTermoEntidade",
DROP COLUMN "categoriaId",
DROP COLUMN "cidade",
DROP COLUMN "ctgCanditadoId",
DROP COLUMN "estado",
DROP COLUMN "fichaInscricao",
DROP COLUMN "nomeCompleto",
DROP COLUMN "numCarteirinha",
DROP COLUMN "provaCampeiraEsportiva",
ADD COLUMN     "ProvaCampeiraEsportiva" "ProvaCampeiraEsportiva",
ADD COLUMN     "cTGIdCTG" INTEGER NOT NULL,
ADD COLUMN     "categoria" INTEGER NOT NULL,
ADD COLUMN     "categoriaIdCategoria" INTEGER NOT NULL,
ADD COLUMN     "pessoaId" INTEGER NOT NULL,
ALTER COLUMN "RG" SET DATA TYPE TEXT,
ALTER COLUMN "endereco" SET DATA TYPE TEXT,
ALTER COLUMN "bairro" SET DATA TYPE TEXT,
ALTER COLUMN "escolaridade" SET DATA TYPE TEXT,
ALTER COLUMN "filiacao" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PreferenciaSorteioDanca" ADD COLUMN     "sorteioDancaIdSorteio" INTEGER;

-- AlterTable
ALTER TABLE "ProvaPratica" DROP COLUMN "nomeProva",
ADD COLUMN     "idProva" INTEGER NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProvaTeorica" DROP CONSTRAINT "ProvaTeorica_pkey",
DROP COLUMN "idProvaTeorica",
DROP COLUMN "nomeProva",
ADD COLUMN     "idProva" INTEGER NOT NULL,
ADD COLUMN     "idprovaTeorica" SERIAL NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD CONSTRAINT "ProvaTeorica_pkey" PRIMARY KEY ("idprovaTeorica");

-- AlterTable
ALTER TABLE "Recurso" ADD COLUMN     "provaIdProva" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "CTGUsuario",
DROP COLUMN "cidade",
DROP COLUMN "estado",
DROP COLUMN "nomeCompleto",
DROP COLUMN "numCarteirinha",
ADD COLUMN     "cTGIdCTG" INTEGER NOT NULL,
ADD COLUMN     "pessoaId" INTEGER NOT NULL,
ALTER COLUMN "login" SET DATA TYPE TEXT,
ALTER COLUMN "senha" SET DATA TYPE TEXT,
DROP COLUMN "funcao",
ADD COLUMN     "funcao" "funcao" NOT NULL,
ALTER COLUMN "numCredenciamento" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "Funcao";

-- CreateTable
CREATE TABLE "Pessoa" (
    "idPessoa" SERIAL NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "numCarteirinha" TEXT NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("idPessoa")
);

-- CreateTable
CREATE TABLE "Prova" (
    "idProva" SERIAL NOT NULL,
    "nomeProva" TEXT NOT NULL,
    "tipo" "TipoProva" NOT NULL,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("idProva")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_pessoaId_key" ON "Candidato"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProvaPratica_idProva_key" ON "ProvaPratica"("idProva");

-- CreateIndex
CREATE UNIQUE INDEX "ProvaTeorica_idProva_key" ON "ProvaTeorica"("idProva");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_pessoaId_key" ON "Usuario"("pessoaId");

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("idPessoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_cTGIdCTG_fkey" FOREIGN KEY ("cTGIdCTG") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_categoriaIdCategoria_fkey" FOREIGN KEY ("categoriaIdCategoria") REFERENCES "Categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("idPessoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_cTGIdCTG_fkey" FOREIGN KEY ("cTGIdCTG") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTG" ADD CONSTRAINT "CTG_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("idPessoa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenciaSorteioDanca" ADD CONSTRAINT "PreferenciaSorteioDanca_sorteioDancaIdSorteio_fkey" FOREIGN KEY ("sorteioDancaIdSorteio") REFERENCES "SorteioDanca"("idSorteio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_provaTeoricaId_fkey" FOREIGN KEY ("provaTeoricaId") REFERENCES "ProvaTeorica"("idprovaTeorica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvaTeorica" ADD CONSTRAINT "ProvaTeorica_idProva_fkey" FOREIGN KEY ("idProva") REFERENCES "Prova"("idProva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvaPratica" ADD CONSTRAINT "ProvaPratica_idProva_fkey" FOREIGN KEY ("idProva") REFERENCES "Prova"("idProva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_provaIdProva_fkey" FOREIGN KEY ("provaIdProva") REFERENCES "Prova"("idProva") ON DELETE SET NULL ON UPDATE CASCADE;
