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
class PreferenciaSorteioDancaService {
    selecionarPreferenciaSorteioDanca(nomeSorteioDanca, candidatoId, dancaIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const preferenciaExistente = yield prisma.preferenciaSorteioDanca.findFirst({
                    where: {
                        candidatoId,
                        nomeSorteioDanca
                    }
                });
                if (preferenciaExistente) {
                    throw new Error(`O candidato já definiu suas preferências para a modalidade: ${nomeSorteioDanca}.`);
                }
                const preferenciasCriadas = yield prisma.preferenciaSorteioDanca.create({
                    data: {
                        nomeSorteioDanca,
                        candidatoId,
                        dancas: {
                            connect: dancaIds.map(id => ({ idDanca: id })),
                        },
                    },
                    include: {
                        dancas: true,
                    }
                });
                return preferenciasCriadas;
            }
            catch (error) {
                if (error.code === 'P2002') {
                    throw new Error(`Já existe um grupo de preferências cadastrado para ${nomeSorteioDanca}.`);
                }
                throw new Error("Erro ao criar preferências: " + error.message);
            }
        });
    }
    visualizarPreferencias(candidatoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const preferencias = yield prisma.preferenciaSorteioDanca.findMany({
                where: { candidatoId },
                include: { dancas: true },
            });
            return preferencias;
        });
    }
    atualizarSorteioDancaId(candidatoId, sorteioDancaId, nomeSorteioDanca) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.preferenciaSorteioDanca.updateMany({
                where: { candidatoId, nomeSorteioDanca },
                data: { sorteioDancaId },
            });
        });
    }
    verificarSorteioDancaId(candidatoId, tipoDanca) {
        return __awaiter(this, void 0, void 0, function* () {
            const sorteio = yield prisma.preferenciaSorteioDanca.findFirst({
                where: {
                    candidatoId,
                    nomeSorteioDanca: tipoDanca,
                    sorteioDancaId: { not: null },
                },
            });
            return sorteio !== null;
        });
    }
}
const preferenciaSorteioDanca = new PreferenciaSorteioDancaService();
exports.default = preferenciaSorteioDanca;
