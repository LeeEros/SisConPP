"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CandidatoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarCandidato(nomeCompleto, cidade, estado, CTGId, numCarteirinha, categoriaId, CPF, RG, endereco, numEndereco, bairro, escolaridade, filiacaoPai, filiacaoMae, ProvaCampeiraEsportiva, anexoFoto, anexoDocumento, anexoCarteirinha, anexoEscolaridade, anexoResidencia, anexoAtaConcurso, fichaInscricao, anexoTermoCandidato, anexoRelatorioVivencia, anexoResponsavel, anexoProvaEsportivaCampeira) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidato = yield this.prisma.candidato.create({
                    data: {
                        nomeCompleto,
                        cidade,
                        estado,
                        CTGId,
                        numCarteirinha,
                        CPF,
                        RG,
                        endereco,
                        numEndereco,
                        bairro,
                        escolaridade,
                        filiacaoPai,
                        filiacaoMae,
                        ProvaCampeiraEsportiva,
                        anexoFoto: anexoFoto ? new Uint8Array(anexoFoto) : undefined,
                        anexoDocumento: anexoDocumento ? new Uint8Array(anexoDocumento) : undefined,
                        anexoCarteirinha: anexoCarteirinha ? new Uint8Array(anexoCarteirinha) : undefined,
                        anexoEscolaridade: anexoEscolaridade ? new Uint8Array(anexoEscolaridade) : undefined,
                        anexoResidencia: anexoResidencia ? new Uint8Array(anexoResidencia) : undefined,
                        anexoAtaConcurso: anexoAtaConcurso ? new Uint8Array(anexoAtaConcurso) : undefined,
                        fichaInscricao: fichaInscricao ? new Uint8Array(fichaInscricao) : undefined,
                        anexoTermoCandidato: anexoTermoCandidato ? new Uint8Array(anexoTermoCandidato) : undefined,
                        anexoRelatorioVivencia: anexoRelatorioVivencia ? new Uint8Array(anexoRelatorioVivencia) : undefined,
                        anexoResponsavel: anexoResponsavel ? new Uint8Array(anexoResponsavel) : undefined,
                        anexoProvaEsportivaCampeira: anexoProvaEsportivaCampeira ? new Uint8Array(anexoProvaEsportivaCampeira) : undefined,
                        categoriaId
                    }
                });
                return { candidato };
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao criar candidato. Verifique os dados fornecidos.");
            }
        });
    }
    atualizarCandidato(idCandidato, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidatoExistente = yield this.prisma.candidato.findUnique({
                    where: { idCandidato }
                });
                if (!candidatoExistente) {
                    throw new Error("Candidato não encontrado");
                }
                const candidatoAtualizado = yield this.prisma.candidato.update({
                    where: { idCandidato },
                    data: Object.assign(Object.assign({}, data), { anexoFoto: data.anexoFoto ? new Uint8Array(data.anexoFoto) : candidatoExistente.anexoFoto, anexoDocumento: data.anexoDocumento ? new Uint8Array(data.anexoDocumento) : candidatoExistente.anexoDocumento, anexoCarteirinha: data.anexoCarteirinha ? new Uint8Array(data.anexoCarteirinha) : candidatoExistente.anexoCarteirinha, anexoEscolaridade: data.anexoEscolaridade ? new Uint8Array(data.anexoEscolaridade) : candidatoExistente.anexoEscolaridade, anexoResidencia: data.anexoResidencia ? new Uint8Array(data.anexoResidencia) : candidatoExistente.anexoResidencia, anexoAtaConcurso: data.anexoAtaConcurso ? new Uint8Array(data.anexoAtaConcurso) : candidatoExistente.anexoAtaConcurso, fichaInscricao: data.fichaInscricao ? new Uint8Array(data.fichaInscricao) : candidatoExistente.fichaInscricao, anexoTermoCandidato: data.anexoTermoCandidato ? new Uint8Array(data.anexoTermoCandidato) : candidatoExistente.anexoTermoCandidato, anexoRelatorioVivencia: data.anexoRelatorioVivencia ? new Uint8Array(data.anexoRelatorioVivencia) : candidatoExistente.anexoRelatorioVivencia, anexoResponsavel: data.anexoResponsavel ? new Uint8Array(data.anexoResponsavel) : candidatoExistente.anexoResponsavel, anexoProvaEsportivaCampeira: data.anexoProvaEsportivaCampeira ? new Uint8Array(data.anexoProvaEsportivaCampeira) : candidatoExistente.anexoProvaEsportivaCampeira })
                });
                return candidatoAtualizado;
            }
            catch (error) {
                console.error(error);
                throw new Error("Erro ao atualizar candidato. Verifique os dados fornecidos.");
            }
        });
    }
    buscarCandidatoPorId(idCandidato) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidato = yield this.prisma.candidato.findUnique({
                    where: { idCandidato: idCandidato },
                    include: {
                        Categoria: true,
                        CTG: true
                    }
                });
                return candidato;
            }
            catch (error) {
                throw new Error("Erro ao buscar candidato.");
            }
        });
    }
    buscarCandidatos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidatos = yield this.prisma.candidato.findMany();
                return candidatos;
            }
            catch (error) {
                throw new Error("Erro ao buscar candidatos.");
            }
        });
    }
    deletarCandidato(idCandidato) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("IdCandidato:", idCandidato);
                const candidato = yield this.prisma.candidato.findUnique({
                    where: { idCandidato },
                });
                if (!candidato) {
                    throw new Error("Candidato não encontrado.");
                }
                yield this.prisma.candidato.delete({
                    where: { idCandidato },
                });
                return { mensagem: "Candidato deletado com sucesso." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Erro ao deletar candidato.");
            }
        });
    }
    anexarAnexos(idCandidato, anexos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidato = yield this.prisma.candidato.update({
                    where: { idCandidato: idCandidato },
                    data: {
                        anexoFoto: anexos.anexoFoto ? new Uint8Array(anexos.anexoFoto) : undefined,
                        anexoDocumento: anexos.anexoDocumento ? new Uint8Array(anexos.anexoDocumento) : undefined,
                        anexoCarteirinha: anexos.anexoCarteirinha ? new Uint8Array(anexos.anexoCarteirinha) : undefined,
                        anexoEscolaridade: anexos.anexoEscolaridade ? new Uint8Array(anexos.anexoEscolaridade) : undefined,
                        anexoResidencia: anexos.anexoResidencia ? new Uint8Array(anexos.anexoResidencia) : undefined,
                        anexoAtaConcurso: anexos.anexoAtaConcurso ? new Uint8Array(anexos.anexoAtaConcurso) : undefined,
                        fichaInscricao: anexos.fichaInscricao ? new Uint8Array(anexos.fichaInscricao) : undefined,
                        anexoTermoCandidato: anexos.anexoTermoCandidato ? new Uint8Array(anexos.anexoTermoCandidato) : undefined,
                        anexoRelatorioVivencia: anexos.anexoRelatorioVivencia ? new Uint8Array(anexos.anexoRelatorioVivencia) : undefined,
                        anexoResponsavel: anexos.anexoResponsavel ? new Uint8Array(anexos.anexoResponsavel) : undefined,
                        anexoProvaEsportivaCampeira: anexos.anexoProvaEsportivaCampeira ? new Uint8Array(anexos.anexoProvaEsportivaCampeira) : undefined
                    }
                });
                return candidato;
            }
            catch (error) {
                throw new Error("Erro ao anexar anexos.");
            }
        });
    }
    visualizarAnexos(idCandidato) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidato = yield this.prisma.candidato.findUnique({
                    where: { idCandidato: idCandidato }
                });
                if (candidato) {
                    return {
                        anexoFoto: candidato.anexoFoto,
                        anexoDocumento: candidato.anexoDocumento,
                        anexoCarteirinha: candidato.anexoCarteirinha,
                        anexoEscolaridade: candidato.anexoEscolaridade,
                        anexoResidencia: candidato.anexoResidencia,
                        anexoAtaConcurso: candidato.anexoAtaConcurso,
                        fichaInscricao: candidato.fichaInscricao,
                        anexoTermoCandidato: candidato.anexoTermoCandidato,
                        anexoRelatorioVivencia: candidato.anexoRelatorioVivencia,
                        anexoResponsavel: candidato.anexoResponsavel,
                        anexoProvaEsportivaCampeira: candidato.anexoProvaEsportivaCampeira
                    };
                }
                else {
                    throw new Error("Candidato não encontrado.");
                }
            }
            catch (error) {
                throw new Error("Erro ao visualizar anexos.");
            }
        });
    }
    editarAnexos(idCandidato, anexos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidato = yield this.prisma.candidato.update({
                    where: { idCandidato: idCandidato },
                    data: {
                        anexoFoto: anexos.anexoFoto ? new Uint8Array(anexos.anexoFoto) : undefined,
                        anexoDocumento: anexos.anexoDocumento ? new Uint8Array(anexos.anexoDocumento) : undefined,
                        anexoCarteirinha: anexos.anexoCarteirinha ? new Uint8Array(anexos.anexoCarteirinha) : undefined,
                        anexoEscolaridade: anexos.anexoEscolaridade ? new Uint8Array(anexos.anexoEscolaridade) : undefined,
                        anexoResidencia: anexos.anexoResidencia ? new Uint8Array(anexos.anexoResidencia) : undefined,
                        anexoAtaConcurso: anexos.anexoAtaConcurso ? new Uint8Array(anexos.anexoAtaConcurso) : undefined,
                        fichaInscricao: anexos.fichaInscricao ? new Uint8Array(anexos.fichaInscricao) : undefined,
                        anexoTermoCandidato: anexos.anexoTermoCandidato ? new Uint8Array(anexos.anexoTermoCandidato) : undefined,
                        anexoRelatorioVivencia: anexos.anexoRelatorioVivencia ? new Uint8Array(anexos.anexoRelatorioVivencia) : undefined,
                        anexoResponsavel: anexos.anexoResponsavel ? new Uint8Array(anexos.anexoResponsavel) : undefined,
                        anexoProvaEsportivaCampeira: anexos.anexoProvaEsportivaCampeira ? new Uint8Array(anexos.anexoProvaEsportivaCampeira) : undefined
                    }
                });
                return candidato;
            }
            catch (error) {
                throw new Error("Erro ao editar anexos.");
            }
        });
    }
    criarFichaCandidato(candidatoId, concursoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fichaCandidato = yield this.prisma.fichaCandidato.create({
                    data: {
                        candidatoId,
                        concursoId,
                        notaCandidato: 0,
                        notaFinalProvaTeorica: 0,
                        notaFinalProvasPraticas: 0,
                        anexoTermodeCiencia: Buffer.from(""),
                        anexoGabarito: Buffer.from(""),
                        anexoRedacao: Buffer.from(""),
                        anexoProvaPratica: Buffer.from("")
                    },
                });
                yield this.prisma.candidato.update({
                    where: { idCandidato: candidatoId },
                    data: {
                        concursoIdConcurso: concursoId
                    }
                });
                return fichaCandidato;
            }
            catch (error) {
                console.error("Erro ao criar ficha do candidato:", error);
                throw new Error("Erro ao criar ficha do candidato");
            }
        });
    }
    buscarIdFicha(candidatoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fichaCandidatoId = yield this.prisma.fichaCandidato.findUnique({
                    where: { candidatoId: candidatoId }
                });
                if (!fichaCandidatoId) {
                    throw new Error("Ficha do candidato não encontrada.");
                }
                ;
                return fichaCandidatoId;
            }
            catch (error) {
                throw new Error("Erro ao buscar Id da Ficha do Candidato.");
            }
        });
    }
}
const candidatoService = new CandidatoService(prisma);
exports.default = candidatoService;
