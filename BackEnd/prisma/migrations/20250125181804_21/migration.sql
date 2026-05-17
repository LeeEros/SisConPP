-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pessoaId_fkey";

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("idPessoa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("idPessoa") ON DELETE CASCADE ON UPDATE CASCADE;
