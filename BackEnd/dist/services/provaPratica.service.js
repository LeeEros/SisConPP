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
class ProvaPraticaService {
    criarProvaPratica(nomeProva, notaMaxima, categorias, blocodProva) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provaPratica = yield prisma.provaPratica.create({
                    data: {
                        nomeProva,
                        notaMaxima,
                        categorias: {
                            connect: categorias === null || categorias === void 0 ? void 0 : categorias.map((id) => ({
                                idCategoria: id,
                            })),
                        },
                        blocosProvas: {
                            connect: blocodProva === null || blocodProva === void 0 ? void 0 : blocodProva.map((id) => ({
                                idBloco: id,
                            })),
                        },
                    }
                });
                return provaPratica;
            }
            catch (error) {
                console.error("Erro ao criar prova prática:", error);
                throw new Error("Erro ao criar prova prática. Verifique os dados fornecidos.");
            }
        });
    }
    buscarProvaPraticaPorId(idProvaPratica) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provaPratica = yield prisma.provaPratica.findUnique({
                    where: { idProvaPratica }
                });
                return provaPratica;
            }
            catch (error) {
                console.error("Erro ao listar prova prática:", error);
                throw new Error("Erro ao listar prova prática.");
            }
        });
    }
    buscarProvasPraticas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provasPraticas = yield prisma.provaPratica.findMany({
                    include: {
                        blocosProvas: {
                            include: {
                                quesitos: {
                                    include: {
                                        subQuesitos: true
                                    }
                                }
                            }
                        }
                    }
                });
                return provasPraticas;
            }
            catch (error) {
                console.error("Erro ao listar provas práticas:", error);
                throw new Error("Erro ao listar provas práticas.");
            }
        });
    }
    buscarProvaPraticaPorCategoria(categoriaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provaPraticaPorCategoria = yield prisma.provaPratica.findMany({
                where: {
                    categorias: {
                        some: {
                            idCategoria: categoriaId
                        }
                    }
                },
                include: {
                    blocosProvas: {
                        include: {
                            quesitos: {
                                include: {
                                    subQuesitos: true
                                }
                            }
                        }
                    }
                }
            });
            return provaPraticaPorCategoria;
        });
    }
    atualizarProvaPratica(idProvaPratica, nomeProva, notaMaxima, categorias, blocodProva) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provaPratica = yield prisma.provaPratica.update({
                    where: { idProvaPratica },
                    data: {
                        nomeProva,
                        notaMaxima,
                        categorias: {
                            connect: categorias === null || categorias === void 0 ? void 0 : categorias.map((id) => ({
                                idCategoria: id,
                            })),
                        },
                        blocosProvas: {
                            connect: blocodProva === null || blocodProva === void 0 ? void 0 : blocodProva.map((id) => ({
                                idBloco: id,
                            })),
                        },
                    },
                });
                return provaPratica;
            }
            catch (error) {
                console.error("Erro ao atualizar prova prática:", error);
                throw new Error("Erro ao atualizar prova prática. Verifique os dados fornecidos.");
            }
        });
    }
}
const provaPraticaService = new ProvaPraticaService();
exports.default = provaPraticaService;
