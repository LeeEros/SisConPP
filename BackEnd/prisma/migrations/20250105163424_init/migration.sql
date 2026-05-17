-- CreateEnum
CREATE TYPE "ProvaCampeiraEsportiva" AS ENUM ('CAMPEIRA', 'ESPORTIVA');

-- CreateEnum
CREATE TYPE "Funcao" AS ENUM ('SECRETARIO', 'AVALIADOR', 'AUXILIAR');

-- CreateEnum
CREATE TYPE "DancaSalaoTradicional" AS ENUM ('DANCA_DE_SALAO', 'DANCA_TRADICIONAL');

-- CreateTable
CREATE TABLE "Candidato" (
    "idCandidato" SERIAL NOT NULL,
    "nomeCompleto" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "numCarteirinha" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "RG" VARCHAR(20) NOT NULL,
    "endereco" VARCHAR(255) NOT NULL,
    "numEndereco" INTEGER NOT NULL,
    "bairro" VARCHAR(100) NOT NULL,
    "escolaridade" VARCHAR(100) NOT NULL,
    "filiacao" VARCHAR(255) NOT NULL,
    "provaCampeiraEsportiva" "ProvaCampeiraEsportiva" NOT NULL,
    "anexoDocumento" BYTEA NOT NULL,
    "anexoCarteirinha" BYTEA NOT NULL,
    "anexoEscolaridade" BYTEA NOT NULL,
    "anexoResidencia" BYTEA NOT NULL,
    "anexoAtaConcurso" BYTEA NOT NULL,
    "fichaInscricao" BYTEA NOT NULL,
    "anexoTermoEntidade" BYTEA NOT NULL,
    "anexoTermoCandidato" BYTEA NOT NULL,
    "anexoRelatorioVivencia" BYTEA NOT NULL,
    "anexoResponsável" BYTEA,
    "anexoProvaEsportivaCampeira" BYTEA NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "concursoIdConcurso" INTEGER NOT NULL,
    "ctgCanditadoId" INTEGER NOT NULL,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("idCandidato")
);

-- CreateTable
CREATE TABLE "CTG" (
    "idCTG" SERIAL NOT NULL,
    "nomeCTG" VARCHAR(100) NOT NULL,
    "RTid" INTEGER NOT NULL,

    CONSTRAINT "CTG_pkey" PRIMARY KEY ("idCTG")
);

-- CreateTable
CREATE TABLE "RT" (
    "idRT" SERIAL NOT NULL,
    "nomeRT" VARCHAR(100) NOT NULL,

    CONSTRAINT "RT_pkey" PRIMARY KEY ("idRT")
);

-- CreateTable
CREATE TABLE "PreferenciaSorteioDanca" (
    "idPreferecnia" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,

    CONSTRAINT "PreferenciaSorteioDanca_pkey" PRIMARY KEY ("idPreferecnia")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nomeCompleto" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "numCarteirinha" TEXT NOT NULL,
    "login" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "funcao" "Funcao" NOT NULL,
    "numCredenciamento" VARCHAR(50),
    "concursoIdConcurso" INTEGER NOT NULL,
    "CTGUsuario" INTEGER NOT NULL,
    "comissaoIdComissao" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Concurso" (
    "idConcurso" SERIAL NOT NULL,
    "nomeConcurso" VARCHAR(100) NOT NULL,
    "lancamentoEdital" TIMESTAMP(3) NOT NULL,
    "inscricoesInicio" TIMESTAMP(3) NOT NULL,
    "inscricoesFinal" TIMESTAMP(3) NOT NULL,
    "dataProvaEscrita" TIMESTAMP(3) NOT NULL,
    "dataProvasPraticas" TIMESTAMP(3) NOT NULL,
    "dataResultado" TIMESTAMP(3) NOT NULL,
    "local" VARCHAR(255) NOT NULL,

    CONSTRAINT "Concurso_pkey" PRIMARY KEY ("idConcurso")
);

-- CreateTable
CREATE TABLE "Comissao" (
    "idComissao" SERIAL NOT NULL,
    "nomeComissao" VARCHAR(100) NOT NULL,
    "concursoId" INTEGER NOT NULL,

    CONSTRAINT "Comissao_pkey" PRIMARY KEY ("idComissao")
);

-- CreateTable
CREATE TABLE "ComissaoUsuario" (
    "id" SERIAL NOT NULL,
    "comissaoId" INTEGER NOT NULL,
    "UsuarioId" INTEGER NOT NULL,

    CONSTRAINT "ComissaoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "idCategoria" SERIAL NOT NULL,
    "nomeCategoria" VARCHAR(50) NOT NULL,
    "idadeInicial" INTEGER NOT NULL,
    "idadeLimite" INTEGER,
    "escolaridade" TEXT NOT NULL,
    "sorteioDanca" INTEGER NOT NULL,
    "provaTeoricaId" INTEGER NOT NULL,
    "provaPraticaId" INTEGER NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "Avalicao" (
    "idAvalicao" SERIAL NOT NULL,
    "dataAvaliacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comissaoId" INTEGER NOT NULL,
    "avaliadorId" INTEGER NOT NULL,
    "candidatoId" INTEGER NOT NULL,

    CONSTRAINT "Avalicao_pkey" PRIMARY KEY ("idAvalicao")
);

-- CreateTable
CREATE TABLE "ProvaTeorica" (
    "idProvaTeorica" SERIAL NOT NULL,
    "nomeProva" TEXT NOT NULL,

    CONSTRAINT "ProvaTeorica_pkey" PRIMARY KEY ("idProvaTeorica")
);

-- CreateTable
CREATE TABLE "ProvaPratica" (
    "idProvaPratica" SERIAL NOT NULL,
    "nomeProva" TEXT NOT NULL,

    CONSTRAINT "ProvaPratica_pkey" PRIMARY KEY ("idProvaPratica")
);

-- CreateTable
CREATE TABLE "BlocoProva" (
    "idBloco" SERIAL NOT NULL,
    "nomeBloco" TEXT NOT NULL,
    "notaMaximaBloco" DOUBLE PRECISION NOT NULL,
    "provaPraticaIdProvaPratica" INTEGER,

    CONSTRAINT "BlocoProva_pkey" PRIMARY KEY ("idBloco")
);

-- CreateTable
CREATE TABLE "Quesitos" (
    "idQuesito" SERIAL NOT NULL,
    "nomeQuesito" TEXT NOT NULL,
    "notaMaximaQuesito" DOUBLE PRECISION NOT NULL,
    "danca" BOOLEAN NOT NULL,
    "dancaSalaoTradicional" "DancaSalaoTradicional" NOT NULL,

    CONSTRAINT "Quesitos_pkey" PRIMARY KEY ("idQuesito")
);

-- CreateTable
CREATE TABLE "SubQuesitos" (
    "idSubequestios" SERIAL NOT NULL,
    "nomeSubquesito" TEXT NOT NULL,
    "notaSubequesito" DOUBLE PRECISION NOT NULL,
    "quesitoId" INTEGER NOT NULL,

    CONSTRAINT "SubQuesitos_pkey" PRIMARY KEY ("idSubequestios")
);

-- CreateTable
CREATE TABLE "Recurso" (
    "idRecurso" SERIAL NOT NULL,
    "nomeRecurso" TEXT NOT NULL,
    "justificativa" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "dataRecurso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avaliador" INTEGER NOT NULL,
    "quesitoRecurso" INTEGER NOT NULL,

    CONSTRAINT "Recurso_pkey" PRIMARY KEY ("idRecurso")
);

-- CreateTable
CREATE TABLE "SorteioDanca" (
    "idSorteio" SERIAL NOT NULL,
    "resultadoSorteio" INTEGER NOT NULL,
    "dataSorteio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidatoId" INTEGER NOT NULL,
    "UsuarioId" INTEGER NOT NULL,

    CONSTRAINT "SorteioDanca_pkey" PRIMARY KEY ("idSorteio")
);

-- CreateTable
CREATE TABLE "_SubQuesitosSub" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubQuesitosSub_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_numCarteirinha_key" ON "Candidato"("numCarteirinha");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_CPF_key" ON "Candidato"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_numCarteirinha_key" ON "Usuario"("numCarteirinha");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_login_key" ON "Usuario"("login");

-- CreateIndex
CREATE INDEX "_SubQuesitosSub_B_index" ON "_SubQuesitosSub"("B");

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_concursoIdConcurso_fkey" FOREIGN KEY ("concursoIdConcurso") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_ctgCanditadoId_fkey" FOREIGN KEY ("ctgCanditadoId") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTG" ADD CONSTRAINT "CTG_RTid_fkey" FOREIGN KEY ("RTid") REFERENCES "RT"("idRT") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenciaSorteioDanca" ADD CONSTRAINT "PreferenciaSorteioDanca_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_concursoIdConcurso_fkey" FOREIGN KEY ("concursoIdConcurso") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_CTGUsuario_fkey" FOREIGN KEY ("CTGUsuario") REFERENCES "CTG"("idCTG") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_comissaoIdComissao_fkey" FOREIGN KEY ("comissaoIdComissao") REFERENCES "Comissao"("idComissao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comissao" ADD CONSTRAINT "Comissao_concursoId_fkey" FOREIGN KEY ("concursoId") REFERENCES "Concurso"("idConcurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComissaoUsuario" ADD CONSTRAINT "ComissaoUsuario_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "Comissao"("idComissao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComissaoUsuario" ADD CONSTRAINT "ComissaoUsuario_UsuarioId_fkey" FOREIGN KEY ("UsuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_provaTeoricaId_fkey" FOREIGN KEY ("provaTeoricaId") REFERENCES "ProvaTeorica"("idProvaTeorica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_provaPraticaId_fkey" FOREIGN KEY ("provaPraticaId") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avalicao" ADD CONSTRAINT "Avalicao_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "Comissao"("idComissao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avalicao" ADD CONSTRAINT "Avalicao_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avalicao" ADD CONSTRAINT "Avalicao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlocoProva" ADD CONSTRAINT "BlocoProva_provaPraticaIdProvaPratica_fkey" FOREIGN KEY ("provaPraticaIdProvaPratica") REFERENCES "ProvaPratica"("idProvaPratica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubQuesitos" ADD CONSTRAINT "SubQuesitos_quesitoId_fkey" FOREIGN KEY ("quesitoId") REFERENCES "Quesitos"("idQuesito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_avaliador_fkey" FOREIGN KEY ("avaliador") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_quesitoRecurso_fkey" FOREIGN KEY ("quesitoRecurso") REFERENCES "Quesitos"("idQuesito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteioDanca" ADD CONSTRAINT "SorteioDanca_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("idCandidato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteioDanca" ADD CONSTRAINT "SorteioDanca_UsuarioId_fkey" FOREIGN KEY ("UsuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubQuesitosSub" ADD CONSTRAINT "_SubQuesitosSub_A_fkey" FOREIGN KEY ("A") REFERENCES "SubQuesitos"("idSubequestios") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubQuesitosSub" ADD CONSTRAINT "_SubQuesitosSub_B_fkey" FOREIGN KEY ("B") REFERENCES "SubQuesitos"("idSubequestios") ON DELETE CASCADE ON UPDATE CASCADE;
