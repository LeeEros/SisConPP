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
exports.RelatoriosService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RelatoriosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    relatorioGeralPorConcurso(concursoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fichas = yield prisma.fichaCandidato.findMany({
                where: {
                    concursoId,
                },
                include: {
                    Candidato: {
                        include: {
                            Categoria: true,
                        },
                    },
                    Concurso: true,
                },
                orderBy: [
                    {
                        Candidato: {
                            Categoria: {
                                nomeCategoria: "asc",
                            },
                        },
                    },
                    {
                        notaCandidato: "desc",
                    },
                ],
            });
            return fichas.map((ficha) => {
                var _a, _b, _c;
                return ({
                    candidatoId: ficha.candidatoId,
                    nomeCandidato: ficha.Candidato.nomeCompleto,
                    categoria: ficha.Candidato.Categoria.nomeCategoria,
                    concurso: ficha.Concurso.nomeConcurso,
                    notaProvaTeorica: (_a = ficha.notaFinalProvaTeorica) !== null && _a !== void 0 ? _a : 0,
                    notaProvasPraticas: (_b = ficha.notaFinalProvasPraticas) !== null && _b !== void 0 ? _b : 0,
                    notaFinal: (_c = ficha.notaCandidato) !== null && _c !== void 0 ? _c : 0,
                });
            });
        });
    }
    rankingPorCategoria(concursoId, categoriaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fichas = yield prisma.fichaCandidato.findMany({
                where: {
                    concursoId,
                    Candidato: {
                        categoriaId,
                    },
                },
                include: {
                    Candidato: {
                        include: {
                            Categoria: true,
                        },
                    },
                    Concurso: true,
                },
                orderBy: {
                    notaCandidato: "desc",
                },
            });
            let classificacao = 1;
            let ultimaNota = null;
            return fichas.map((ficha, index) => {
                var _a;
                if (ultimaNota !== ficha.notaCandidato) {
                    classificacao = index + 1;
                    ultimaNota = ficha.notaCandidato;
                }
                return {
                    candidatoId: ficha.candidatoId,
                    nomeCandidato: ficha.Candidato.nomeCompleto,
                    concurso: ficha.Concurso.nomeConcurso,
                    categoria: ficha.Candidato.Categoria.nomeCategoria,
                    notaFinal: (_a = ficha.notaCandidato) !== null && _a !== void 0 ? _a : 0,
                    classificacao,
                };
            });
        });
    }
    gerarRelatorioIndividualDetalhado(candidatoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            const avaliacoes = yield prisma.avaliacao.findMany({
                where: { candidatoId },
                include: {
                    Usuario: {
                        select: {
                            idUsuario: true,
                            nomeCompleto: true,
                        },
                    },
                    quesitosAvaliados: {
                        include: {
                            Quesito: {
                                include: {
                                    BlocoProva: true,
                                },
                            },
                            subQuesitosAvaliados: {
                                include: {
                                    SubQuesito: {
                                        select: {
                                            nomeSubquesito: true,
                                            subGrupo: true, // ✅ para agrupar no front (Vivência)
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            const avaliadoresMap = new Map();
            let totalFinal = 0;
            for (const avaliacao of avaliacoes) {
                /**
                 * ======================================================
                 * 🔹 PROVA TEÓRICA
                 * ======================================================
                 */
                if (avaliacao.provaTeoricaId) {
                    const idAvaliador = -1;
                    if (!avaliadoresMap.has(idAvaliador)) {
                        avaliadoresMap.set(idAvaliador, {
                            nomeAvaliador: "Prova Teórica",
                            blocos: new Map(),
                            totalAvaliador: 0,
                        });
                    }
                    const avaliador = avaliadoresMap.get(idAvaliador);
                    if (!avaliador.blocos.has(avaliacao.provaTeoricaId)) {
                        avaliador.blocos.set(avaliacao.provaTeoricaId, {
                            nomeBloco: "Prova Teórica",
                            quesitos: new Map(),
                            totalBloco: 0,
                        });
                    }
                    const blocoMap = avaliador.blocos.get(avaliacao.provaTeoricaId);
                    for (const aq of avaliacao.quesitosAvaliados) {
                        const subquesitos = (_b = (_a = aq.subQuesitosAvaliados) === null || _a === void 0 ? void 0 : _a.filter((sq) => sq.notaSubQuesito !== null && sq.notaSubQuesito !== 0).map((sq) => {
                            var _a, _b, _c, _d;
                            return ({
                                nomeSubQuesito: (_b = (_a = sq.SubQuesito) === null || _a === void 0 ? void 0 : _a.nomeSubquesito) !== null && _b !== void 0 ? _b : "",
                                nota: sq.notaSubQuesito,
                                subGrupo: (_d = (_c = sq.SubQuesito) === null || _c === void 0 ? void 0 : _c.subGrupo) !== null && _d !== void 0 ? _d : null,
                            });
                        })) !== null && _b !== void 0 ? _b : [];
                        const temNota = aq.notaQuesito !== null && aq.notaQuesito !== 0;
                        if (!temNota && subquesitos.length === 0)
                            continue;
                        blocoMap.quesitos.set(aq.Quesito.idQuesito, {
                            nomeQuesito: aq.Quesito.nomeQuesito,
                            notaQuesito: ((_c = aq.notaQuesito) !== null && _c !== void 0 ? _c : 0),
                            comentario: ((_d = aq.comentario) === null || _d === void 0 ? void 0 : _d.trim()) ? aq.comentario : null,
                            subquesitos,
                        });
                        blocoMap.totalBloco += ((_e = aq.notaQuesito) !== null && _e !== void 0 ? _e : 0);
                        avaliador.totalAvaliador += ((_f = aq.notaQuesito) !== null && _f !== void 0 ? _f : 0);
                        totalFinal += ((_g = aq.notaQuesito) !== null && _g !== void 0 ? _g : 0);
                    }
                    if (blocoMap.quesitos.size === 0) {
                        avaliador.blocos.delete(avaliacao.provaTeoricaId);
                    }
                    continue;
                }
                /**
                 * ======================================================
                 * 🔹 AVALIADORES HUMANOS
                 * ======================================================
                 */
                const idAvaliador = avaliacao.Usuario.idUsuario;
                if (!avaliadoresMap.has(idAvaliador)) {
                    avaliadoresMap.set(idAvaliador, {
                        nomeAvaliador: avaliacao.Usuario.nomeCompleto,
                        blocos: new Map(),
                        totalAvaliador: 0,
                    });
                }
                const avaliador = avaliadoresMap.get(idAvaliador);
                for (const aq of avaliacao.quesitosAvaliados) {
                    const quesito = aq.Quesito;
                    const bloco = quesito === null || quesito === void 0 ? void 0 : quesito.BlocoProva;
                    if (!quesito || !bloco)
                        continue;
                    // ✅ Aceita negativos e ignora 0 (para não listar "não avaliado")
                    const subquesitos = (_j = (_h = aq.subQuesitosAvaliados) === null || _h === void 0 ? void 0 : _h.filter((sq) => sq.notaSubQuesito !== null && sq.notaSubQuesito !== 0).map((sq) => {
                        var _a, _b, _c, _d;
                        return ({
                            nomeSubQuesito: (_b = (_a = sq.SubQuesito) === null || _a === void 0 ? void 0 : _a.nomeSubquesito) !== null && _b !== void 0 ? _b : "",
                            nota: sq.notaSubQuesito,
                            subGrupo: (_d = (_c = sq.SubQuesito) === null || _c === void 0 ? void 0 : _c.subGrupo) !== null && _d !== void 0 ? _d : null,
                        });
                    })) !== null && _j !== void 0 ? _j : [];
                    // ✅ Aceita negativos; 0 significa "não avaliado"
                    const temNota = aq.notaQuesito !== null && aq.notaQuesito !== 0;
                    // ✅ não entra no relatório se não tiver nada avaliado
                    if (!temNota && subquesitos.length === 0)
                        continue;
                    if (!avaliador.blocos.has(bloco.idBloco)) {
                        avaliador.blocos.set(bloco.idBloco, {
                            nomeBloco: bloco.nomeBloco,
                            quesitos: new Map(),
                            totalBloco: 0,
                        });
                    }
                    const blocoMap = avaliador.blocos.get(bloco.idBloco);
                    blocoMap.quesitos.set(quesito.idQuesito, {
                        nomeQuesito: quesito.nomeQuesito,
                        notaQuesito: ((_k = aq.notaQuesito) !== null && _k !== void 0 ? _k : 0),
                        comentario: ((_l = aq.comentario) === null || _l === void 0 ? void 0 : _l.trim()) ? aq.comentario : null,
                        subquesitos,
                    });
                    // ✅ soma negativos normalmente
                    blocoMap.totalBloco += ((_m = aq.notaQuesito) !== null && _m !== void 0 ? _m : 0);
                    avaliador.totalAvaliador += ((_o = aq.notaQuesito) !== null && _o !== void 0 ? _o : 0);
                    totalFinal += ((_p = aq.notaQuesito) !== null && _p !== void 0 ? _p : 0);
                }
            }
            /**
             * ======================================================
             * 🔹 DADOS DO CANDIDATO
             * ======================================================
             */
            const ficha = yield prisma.fichaCandidato.findUnique({
                where: { candidatoId },
                include: {
                    Candidato: {
                        select: {
                            idCandidato: true,
                            nomeCompleto: true,
                            Categoria: { select: { nomeCategoria: true } },
                        },
                    },
                    Concurso: {
                        select: { nomeConcurso: true },
                    },
                },
            });
            return {
                candidatoId,
                nomeCandidato: ficha === null || ficha === void 0 ? void 0 : ficha.Candidato.nomeCompleto,
                categoria: ficha === null || ficha === void 0 ? void 0 : ficha.Candidato.Categoria.nomeCategoria,
                concurso: ficha === null || ficha === void 0 ? void 0 : ficha.Concurso.nomeConcurso,
                notaCandidato: ficha === null || ficha === void 0 ? void 0 : ficha.notaCandidato,
                avaliadores: Array.from(avaliadoresMap.values())
                    .filter((av) => av.blocos.size > 0)
                    .sort((a, b) => a.nomeAvaliador.localeCompare(b.nomeAvaliador))
                    .map((av) => ({
                    nomeAvaliador: av.nomeAvaliador,
                    blocos: Array.from(av.blocos.values())
                        .filter((bl) => bl.quesitos.size > 0)
                        .sort((a, b) => a.nomeBloco.localeCompare(b.nomeBloco))
                        .map((bl) => ({
                        nomeBloco: bl.nomeBloco,
                        quesitos: Array.from(bl.quesitos.values()).sort((a, b) => a.nomeQuesito.localeCompare(b.nomeQuesito)),
                        totalBloco: bl.totalBloco,
                    })),
                    totalAvaliador: av.totalAvaliador,
                })),
                totalFinal,
            };
        });
    }
    gerarRelatorioPorCategoriaConcurso(categoriaId, concursoIdConcurso) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidatos = yield prisma.candidato.findMany({
                where: { categoriaId, concursoIdConcurso },
                include: {
                    Categoria: true,
                    Concurso: true,
                    CTG: true,
                    fichaCandidato: true,
                    avalicoes: {
                        include: {
                            Usuario: true,
                            BlocoProva: true,
                            ProvaPratica: true
                        }
                    }
                }
            });
            const relatorio = candidatos.map((c) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                const ficha = c.fichaCandidato;
                // 🔹 NOTAS OFICIAIS (VÊM DA FICHA)
                const notaTeorica = (_a = ficha === null || ficha === void 0 ? void 0 : ficha.notaFinalProvaTeorica) !== null && _a !== void 0 ? _a : 0;
                const notaPratica = (_b = ficha === null || ficha === void 0 ? void 0 : ficha.notaFinalProvasPraticas) !== null && _b !== void 0 ? _b : 0;
                const notaFinal = (_c = ficha === null || ficha === void 0 ? void 0 : ficha.notaCandidato) !== null && _c !== void 0 ? _c : (notaTeorica + notaPratica);
                // 🔹 DETALHAMENTO POR AVALIADOR
                const mapaAvaliadores = new Map();
                ((_d = c.avalicoes) !== null && _d !== void 0 ? _d : []).forEach((av) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    if (!av.avaliadorId)
                        return;
                    const idAvaliador = av.avaliadorId;
                    const nomeAvaliador = (_b = (_a = av.Usuario) === null || _a === void 0 ? void 0 : _a.nomeCompleto) !== null && _b !== void 0 ? _b : "Avaliador";
                    const nomeBloco = (_f = (_d = (_c = av.BlocoProva) === null || _c === void 0 ? void 0 : _c.nomeBloco) !== null && _d !== void 0 ? _d : (_e = av.ProvaPratica) === null || _e === void 0 ? void 0 : _e.nomeProva) !== null && _f !== void 0 ? _f : "Bloco";
                    // ✅ NOTA FINAL JÁ CONSOLIDADA DA AVALIAÇÃO
                    const notaBloco = Number((_g = av.notaFinal) !== null && _g !== void 0 ? _g : 0);
                    if (!mapaAvaliadores.has(idAvaliador)) {
                        mapaAvaliadores.set(idAvaliador, {
                            nomeAvaliador,
                            blocos: [],
                            totalAvaliador: 0
                        });
                    }
                    const avaliador = mapaAvaliadores.get(idAvaliador);
                    avaliador.blocos.push({
                        nomeBloco,
                        notaFinalBloco: notaBloco
                    });
                    avaliador.totalAvaliador += notaBloco;
                });
                return {
                    candidatoId: c.idCandidato,
                    nomeCandidato: c.nomeCompleto,
                    CTG: (_f = (_e = c.CTG) === null || _e === void 0 ? void 0 : _e.nomeCTG) !== null && _f !== void 0 ? _f : "",
                    categoria: (_h = (_g = c.Categoria) === null || _g === void 0 ? void 0 : _g.nomeCategoria) !== null && _h !== void 0 ? _h : "",
                    concurso: (_k = (_j = c.Concurso) === null || _j === void 0 ? void 0 : _j.nomeConcurso) !== null && _k !== void 0 ? _k : "",
                    notaProvaTeorica: notaTeorica,
                    notaProvasPraticas: notaPratica,
                    notaFinal,
                    avaliadores: Array.from(mapaAvaliadores.values())
                };
            });
            // 🔹 ORDENAÇÃO E CLASSIFICAÇÃO
            const ordenado = relatorio.sort((a, b) => b.notaFinal - a.notaFinal);
            return ordenado.map((c, idx) => (Object.assign(Object.assign({}, c), { posicao: idx + 1 })));
        });
    }
}
exports.RelatoriosService = RelatoriosService;
const relatorios = new RelatoriosService(prisma);
exports.default = relatorios;
