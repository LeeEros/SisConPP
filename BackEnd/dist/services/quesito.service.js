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
class QuesitoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarQuesitos(nomeQuesito, notaMaximaQuesito, opcional, blocoProvaIdBloco, provaTeoricaIdprovaTeorica) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (blocoProvaIdBloco !== undefined && blocoProvaIdBloco !== null) {
                    const blocoProvaExiste = yield this.prisma.blocoProva.findUnique({
                        where: { idBloco: blocoProvaIdBloco }
                    });
                    if (!blocoProvaExiste) {
                        throw new Error(`O blocoProvaIdBloco ${blocoProvaIdBloco} não existe.`);
                    }
                }
                if (provaTeoricaIdprovaTeorica !== undefined && provaTeoricaIdprovaTeorica !== null) {
                    const provaTeoricaExiste = yield this.prisma.provaTeorica.findUnique({
                        where: { idprovaTeorica: provaTeoricaIdprovaTeorica }
                    });
                    if (!provaTeoricaExiste) {
                        throw new Error(`A Prova Teorica ${provaTeoricaIdprovaTeorica} não existe.`);
                    }
                }
                const quesito = yield this.prisma.quesitos.create({
                    data: {
                        nomeQuesito: nomeQuesito,
                        notaMaximaQuesito: notaMaximaQuesito,
                        opcional: opcional,
                        blocoProvaIdBloco: blocoProvaIdBloco,
                        provaTeoricaIdprovaTeorica: provaTeoricaIdprovaTeorica
                    },
                });
                return quesito;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao criar Quesito. Verifique os dados fornecidos.");
            }
        });
    }
    atualizarQuesitos(idQuesito, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quesito = yield this.prisma.quesitos.update({
                    where: { idQuesito: idQuesito },
                    data: data,
                });
                return quesito;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao atualizar Quesito. Verifique os dados fornecidos.");
            }
        });
    }
    buscarQuesitoPorId(idQuesito) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quesito = yield this.prisma.quesitos.findUnique({
                    where: { idQuesito: idQuesito },
                });
                return quesito;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao buscar Quesito.");
            }
        });
    }
    buscarQuesitos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quesitos = yield this.prisma.quesitos.findMany();
                return quesitos;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao buscar Quesitos.");
            }
        });
    }
    deletarQuesito(idQuesito) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quesito = yield this.prisma.quesitos.delete({
                    where: { idQuesito: idQuesito },
                });
                return quesito;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao deletar Quesito.");
            }
        });
    }
}
const quesitoService = new QuesitoService(prisma);
exports.default = quesitoService;
