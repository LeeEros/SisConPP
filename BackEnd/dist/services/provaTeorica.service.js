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
const prisma = new client_1.PrismaClient;
class ProvaTeoricaService {
    criarProvaTeorica(nomeProva, notaMaxima, categorias, gabaritoOficial, numQuestao) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provaTeorica = yield prisma.provaTeorica.create({
                    data: Object.assign(Object.assign({ nomeProva,
                        notaMaxima, categorias: {
                            connect: categorias === null || categorias === void 0 ? void 0 : categorias.map((id) => ({
                                idCategoria: id,
                            })),
                        } }, (gabaritoOficial && { gabaritoOficial: new Uint8Array(gabaritoOficial) })), { numQuestao })
                });
                return provaTeorica;
            }
            catch (error) {
                console.error("Erro ao criar prova Teorica:", error);
                throw new Error("Erro ao criar prova Teorica. Verifique os dados fornecidos.");
            }
        });
    }
    buscarProvaTeoricaPorId(provaTeoricaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provaTeorica = yield prisma.provaTeorica.findUnique({
                    where: { idprovaTeorica: provaTeoricaId }
                });
                return provaTeorica;
            }
            catch (error) {
                console.error("Erro ao listar prova Teorica:", error);
                throw new Error("Erro ao listar prova Teorica.");
            }
        });
    }
    buscarProvasTeoricas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provasTeoricas = yield prisma.provaTeorica.findMany({
                    include: {
                        quesitos: {
                            include: {
                                subQuesitos: true
                            }
                        }
                    }
                });
                return provasTeoricas;
            }
            catch (error) {
                console.error("Erro ao listar provas Teoricas:", error);
                throw new Error("Erro ao listar provas Teoricas.");
            }
        });
    }
    buscarProvaTeoricaPorCategoria(categoriaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provaPraticaPorCategoria = yield prisma.provaTeorica.findMany({
                where: {
                    categorias: {
                        some: {
                            idCategoria: categoriaId
                        }
                    }
                },
                include: {
                    quesitos: {
                        include: {
                            subQuesitos: true
                        }
                    }
                }
            });
            return provaPraticaPorCategoria;
        });
    }
    atualizarProvaTeorica(provaTeoricaId, nomeProva, notaMaxima, categorias, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provaTeorica = yield prisma.provaTeorica.update({
                    where: { idprovaTeorica: provaTeoricaId },
                    data: Object.assign(Object.assign({ nomeProva,
                        notaMaxima, categorias: {
                            connect: categorias === null || categorias === void 0 ? void 0 : categorias.map((id) => ({
                                idCategoria: id,
                            })),
                        } }, ((data === null || data === void 0 ? void 0 : data.gabaritoOficial) && { gabaritoOficial: new Uint8Array(data.gabaritoOficial) })), ((data === null || data === void 0 ? void 0 : data.numQuestao) && { numQuestao: data.numQuestao }))
                });
                return provaTeorica;
            }
            catch (error) {
                throw new Error("Erro ao atualizar Prova Teorica. Verefique os dados fornecidos.");
            }
        });
    }
}
const provaTeoricaService = new ProvaTeoricaService();
exports.default = provaTeoricaService;
