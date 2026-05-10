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
class BlocoProvaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarBlocoProva(nomeBloco, notaMaximaBloco, provaPraticaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blocoProva = yield this.prisma.blocoProva.create({
                    data: {
                        nomeBloco,
                        notaMaximaBloco,
                        provaPraticaId
                    }
                });
                return blocoProva;
            }
            catch (error) {
                console.error("Erro ao criar bloco de prova:", error);
                throw new Error("Erro ao criar bloco de prova. Verifique os dados fornecidos.");
            }
        });
    }
    editarBlocoProva(idBloco, nomeBloco, notaMaximaBloco, provaPraticaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blocoProva = yield this.prisma.blocoProva.update({
                    where: { idBloco },
                    data: {
                        nomeBloco,
                        notaMaximaBloco,
                        provaPraticaId
                    }
                });
                return blocoProva;
            }
            catch (error) {
                console.error("Erro ao editar bloco de prova:", error);
                throw new Error("Erro ao editar bloco de prova. Verifique os dados fornecidos.");
            }
        });
    }
    consultarBlocoProva(idBloco) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blocoProva = yield this.prisma.blocoProva.findUnique({
                    where: { idBloco },
                    include: {
                        quesitos: {
                            include: {
                                subQuesitos: true,
                            }
                        }
                    }
                });
                return blocoProva;
            }
            catch (error) {
                console.error("Erro ao consultar bloco de prova:", error);
                throw new Error("Erro ao consultar bloco de prova. Verifique os dados fornecidos.");
            }
        });
    }
    consultarBlocosProva() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blocosProva = yield this.prisma.blocoProva.findMany({
                    orderBy: {
                        idBloco: 'asc'
                    },
                    include: {
                        quesitos: {
                            orderBy: {
                                idQuesito: 'asc'
                            },
                            include: {
                                subQuesitos: true
                            }
                        }
                    }
                });
                return blocosProva;
            }
            catch (error) {
                console.error("Erro ao consultar blocos de prova:", error);
                throw new Error("Erro ao consultar blocos de prova. Verifique os dados fornecidos.");
            }
        });
    }
}
const blocoProvaService = new BlocoProvaService(prisma);
exports.default = blocoProvaService;
