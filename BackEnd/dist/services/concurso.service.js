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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../errors/AppError"));
const prisma = new client_1.PrismaClient;
class ConcursoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarConcurso(nomeConcurso, lancamentoEdital, inscricoesInicio, inscricoesFinal, dataProvaEscrita, dataProvasPraticas, dataResultado, local) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concurso = yield this.prisma.concurso.create({
                    data: {
                        nomeConcurso,
                        lancamentoEdital: new Date(lancamentoEdital),
                        inscricoesInicio: new Date(inscricoesInicio),
                        inscricoesFinal: new Date(inscricoesFinal),
                        dataProvaEscrita: new Date(dataProvaEscrita),
                        dataProvasPraticas: new Date(dataProvasPraticas),
                        dataResultado: new Date(dataResultado),
                        local,
                    },
                });
                console.log("Concurso criado com sucesso.");
                return concurso;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao criar Concurso. Verifique os dados fornecidos.");
            }
        });
    }
    atualizarConcurso(idConcurso, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!idConcurso || isNaN(idConcurso)) {
                    throw new Error("ID do concurso inválido.");
                }
                const dataAtualizada = Object.assign(Object.assign({}, data), { lancamentoEdital: new Date(data.lancamentoEdital), inscricoesInicio: new Date(data.inscricoesInicio), inscricoesFinal: new Date(data.inscricoesFinal), dataProvaEscrita: new Date(data.dataProvaEscrita), dataProvasPraticas: new Date(data.dataProvasPraticas), dataResultado: new Date(data.dataResultado) });
                const concurso = yield this.prisma.concurso.update({
                    where: { idConcurso },
                    data: dataAtualizada,
                });
                console.log("Concurso alterado com sucesso.");
                return concurso;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao atualizar concurso. Verifique os dados fornecidos.");
            }
        });
    }
    buscarConcursoPorId(idConcurso) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concurso = yield this.prisma.concurso.findUnique({
                    where: { idConcurso: idConcurso }
                });
                return concurso;
            }
            catch (error) {
                throw new Error("Erro ao buscar Concurso.");
            }
        });
    }
    buscarConcursos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concursos = yield this.prisma.concurso.findMany();
                return concursos;
            }
            catch (erro) {
                throw new Error("Erro ao buscar concursos");
            }
        });
    }
    deletarConcuro(idConcurso) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concurso = yield this.prisma.concurso.findUnique({
                    where: { idConcurso }
                });
                if (!concurso) {
                    throw new Error("Concurso não encontrado.");
                }
                yield this.prisma.concurso.delete({
                    where: { idConcurso },
                });
                return { mensagem: "Concurso deletado com sucesso." };
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                    throw new Error("Não é possível excluir o concurso pois existem registros vinculados.");
                }
                if (error instanceof AppError_1.default) {
                    throw error;
                }
                throw new AppError_1.default("Erro ao deletar concurso.", 500);
            }
        });
    }
    /*  async buscarCandidatosConcurso(idConcurso: number) {
         try {
             if (!idConcurso || isNaN(idConcurso)) {
                 throw new Error("ID do concurso inválido.");
             }
             return candidatos;
         } catch (error) {
             console.error("Erro ao buscar candidatos do concurso:", error);
             throw new Error("Erro ao buscar candidatos do concurso.");
         }
     } */
    anexarEdital(idConcurso, editalAnexo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concurso = yield prisma.concurso.update({
                    where: { idConcurso },
                    data: { anexoEdital: editalAnexo.anexarEdital }
                });
                return concurso;
            }
            catch (error) {
                throw new Error("Erro ao anexar Edital: " + error);
            }
        });
    }
}
const concursoService = new ConcursoService(prisma);
exports.default = concursoService;
