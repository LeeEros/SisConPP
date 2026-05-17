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
class RecursoServie {
    constructor(prisma) {
        this.prisma = prisma;
    }
    solicitarRecurso(nomeRecurso, justificativa, arquivo, candidatoId, avaliadorId, quesitoRecurso, avaliacaoId, provaTeoricaIdprovaTeorica, provaPraticaIdProvaPratica) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    nomeRecurso,
                    justificativa,
                    dataRecurso: new Date(),
                    status: client_1.StatusRecurso.PENDENTE,
                    arquivos: new Uint8Array(arquivo),
                    Candidato: { connect: { idCandidato: candidatoId } },
                    Usuario: { connect: { idUsuario: avaliadorId } },
                    Quesito: { connect: { idQuesito: quesitoRecurso } },
                    // Se Avaliacao for obrigatória no schema, NÃO pode ser undefined (ver observação abaixo)
                    Avaliacao: {
                        connect: { idAvalicao: avaliacaoId }
                    },
                    ProvaPratica: provaPraticaIdProvaPratica
                        ? { connect: { idProvaPratica: provaPraticaIdProvaPratica } }
                        : undefined,
                    ProvaTeorica: provaTeoricaIdprovaTeorica
                        ? { connect: { idprovaTeorica: provaTeoricaIdprovaTeorica } }
                        : undefined,
                };
                return this.prisma.recurso.create({ data });
            }
            catch (error) {
                console.error("Erro ao criar recurso:", error);
                throw new Error("Erro ao criar recurso.");
            }
        });
    }
    listarRecursos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recursos = yield this.prisma.recurso.findMany({
                    include: {
                        Candidato: true,
                        Usuario: true,
                        Quesito: true,
                        Avaliacao: {
                            include: {
                                quesitosAvaliados: true,
                            }
                        },
                        ProvaTeorica: true,
                        ProvaPratica: true
                    },
                    orderBy: {
                        dataRecurso: "desc"
                    }
                });
                return recursos;
            }
            catch (error) {
                console.error("Erro ao listar recursos:", error);
                throw new Error("Erro ao listar recursos.");
            }
        });
    }
    visualizarRecursoPorId(idRecurso) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recurso = yield this.prisma.recurso.findUnique({
                    where: { idRecurso },
                    include: {
                        Candidato: true,
                        Usuario: true,
                        Quesito: true,
                        Avaliacao: {
                            include: {
                                quesitosAvaliados: true,
                                Candidato: true,
                                Usuario: true
                            }
                        },
                        ProvaTeorica: true,
                        ProvaPratica: true
                    }
                });
                return recurso;
            }
            catch (error) {
                console.error("Erro ao visualizar recurso:", error);
                throw new Error("Erro ao visualizar recurso.");
            }
        });
    }
    alterarStatusRecurso(idRecurso, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recurso = yield this.prisma.recurso.update({
                    where: { idRecurso },
                    data: {
                        status
                    }
                });
                console.log(status);
                return recurso;
            }
            catch (error) {
                console.error("Erro ao alterar status do recurso:", error);
                throw new Error("Erro ao alterar status do recurso.");
            }
        });
    }
    listarQuesitosAvaliadosPorCandidatoEAvaliador(candidatoId, avaliadorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const rows = yield this.prisma.avaliacaoQuesito.findMany({
                where: {
                    Avaliacao: {
                        candidatoId: candidatoId,
                        avaliadorId: avaliadorId,
                    },
                },
                select: {
                    quesitoId: true,
                    notaQuesito: true,
                    comentario: true,
                    Quesito: {
                        select: {
                            idQuesito: true,
                            nomeQuesito: true,
                            notaMaximaQuesito: true,
                            opcional: true,
                        },
                    },
                },
            });
            const map = new Map();
            for (const r of rows) {
                const id = (_b = (_a = r.Quesito) === null || _a === void 0 ? void 0 : _a.idQuesito) !== null && _b !== void 0 ? _b : r.quesitoId;
                if (!map.has(id)) {
                    map.set(id, {
                        idQuesito: (_d = (_c = r.Quesito) === null || _c === void 0 ? void 0 : _c.idQuesito) !== null && _d !== void 0 ? _d : r.quesitoId,
                        nomeQuesito: (_f = (_e = r.Quesito) === null || _e === void 0 ? void 0 : _e.nomeQuesito) !== null && _f !== void 0 ? _f : "Quesito",
                        notaMaximaQuesito: (_h = (_g = r.Quesito) === null || _g === void 0 ? void 0 : _g.notaMaximaQuesito) !== null && _h !== void 0 ? _h : null,
                        opcional: (_k = (_j = r.Quesito) === null || _j === void 0 ? void 0 : _j.opcional) !== null && _k !== void 0 ? _k : null,
                        notaQuesito: r.notaQuesito,
                        comentario: r.comentario,
                    });
                }
            }
            return Array.from(map.values());
        });
    }
}
const recursoService = new RecursoServie(prisma);
exports.default = recursoService;
