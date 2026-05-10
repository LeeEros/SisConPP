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
class DancaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarDanca(nomeDanca, tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.danca.create({
                data: {
                    nomeDanca,
                    dancaSalaoTradicional: tipo,
                },
            });
        });
    }
    atualizarDanca(idDanca, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.danca.update({
                where: { idDanca },
                data: dados,
            });
        });
    }
    buscarDancasTradicionais() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dancas = yield this.prisma.danca.findMany({
                    where: {
                        dancaSalaoTradicional: client_1.DancaSalaoTradicional.DANCA_TRADICIONAL,
                    }
                });
                return dancas;
            }
            catch (error) {
                console.error("Erro ao buscar danças tradicionais:", error);
                throw new Error("Erro ao buscar danças tradicionais");
            }
        });
    }
    buscarDancasSalao() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dancas = yield this.prisma.danca.findMany({
                    where: {
                        dancaSalaoTradicional: client_1.DancaSalaoTradicional.DANCA_DE_SALAO,
                    }
                });
                return dancas;
            }
            catch (error) {
                console.error("Erro ao buscar danças de salão:", error);
                throw new Error("Erro ao buscar danças de salão");
            }
        });
    }
    deletarDanca(idDanca) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.danca.delete({
                where: { idDanca },
            });
        });
    }
}
const dancaService = new DancaService(prisma);
exports.default = dancaService;
