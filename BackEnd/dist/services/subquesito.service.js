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
class SubQuesitosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarsubQuesitos(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const subquesito = yield this.prisma.subQuesitos.create({
                    data: {
                        nomeSubquesito: data.nomeSubquesito,
                        notaSubequesito: data.notaSubequesito,
                        quesitoId: data.quesitoId,
                        subGrupo: (_a = data.subGrupo) !== null && _a !== void 0 ? _a : null,
                    },
                });
                return subquesito;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao criar Subquesito. Verifique os dados fornecidos.");
            }
        });
    }
    atualizarsubQuesitos(idSubequestios, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subquesito = yield this.prisma.subQuesitos.update({
                    where: { idSubequestios },
                    data: Object.assign(Object.assign({}, data), (data.subGrupo !== undefined ? { subGrupo: data.subGrupo } : {})),
                });
                return subquesito;
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao atualizar Subquesito. Verifique os dados fornecidos.");
            }
        });
    }
    buscarSubQuesitoPorId(idSubequestios) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.subQuesitos.findUnique({
                where: { idSubequestios },
                select: {
                    idSubequestios: true,
                    nomeSubquesito: true,
                    notaSubequesito: true,
                    quesitoId: true,
                    subGrupo: true,
                },
            });
        });
    }
    buscarSubQuesitos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.subQuesitos.findMany({
                orderBy: { idSubequestios: "asc" },
                select: {
                    idSubequestios: true,
                    nomeSubquesito: true,
                    notaSubequesito: true,
                    quesitoId: true,
                    subGrupo: true,
                },
            });
        });
    }
    deletarSubQuesito(idSubequestios) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.subQuesitos.delete({
                    where: { idSubequestios },
                });
                return { message: "Subquesito deletado com sucesso." };
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao deletar Subquesito.");
            }
        });
    }
}
const subQuesitosService = new SubQuesitosService(prisma);
exports.default = subQuesitosService;
