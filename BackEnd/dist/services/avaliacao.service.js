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
exports.AvaliacaoService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AvaliacaoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarAvaliacaoCompleta(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const avaliacaoExistente = yield prisma.avaliacao.findFirst({
                        where: {
                            avaliadorId: data.avaliadorId,
                            candidatoId: data.candidatoId,
                            blocoProvaId: data.blocoProvaId,
                        },
                    });
                    if (avaliacaoExistente) {
                        throw new Error("Já existe uma avaliação cadastrada para este avaliador e candidato.");
                    }
                    const avaliacao = yield prisma.avaliacao.create({
                        data: {
                            comissaoId: data.comissaoId,
                            avaliadorId: data.avaliadorId,
                            candidatoId: data.candidatoId,
                            blocoProvaId: data.blocoProvaId,
                            provaPraticaId: data.provaPraticaId,
                            fichaCandidatoIdFicha: data.ficha.idFicha,
                            notaFinal: 0,
                        },
                    });
                    for (const quesito of data.quesitos) {
                        let notaQuesito = 0;
                        for (const sub of quesito.subQuesitos) {
                            notaQuesito += sub.notaSubQuesito;
                        }
                        const avaliacaoQuesito = yield prisma.avaliacaoQuesito.create({
                            data: {
                                avaliacaoId: avaliacao.idAvalicao,
                                quesitoId: quesito.quesitoId,
                                comentario: (_a = quesito.comentario) !== null && _a !== void 0 ? _a : null,
                                notaQuesito,
                            },
                        });
                        for (const sub of quesito.subQuesitos) {
                            yield prisma.avaliacaoSubQuesito.create({
                                data: {
                                    avaliacaoQuesitoId: avaliacaoQuesito.idAvaliacaoQuesito,
                                    subQuesitoId: sub.subQuesitoId,
                                    notaSubQuesito: sub.notaSubQuesito,
                                },
                            });
                        }
                    }
                    const somaQuesitos = yield prisma.avaliacaoQuesito.aggregate({
                        where: { avaliacaoId: avaliacao.idAvalicao },
                        _sum: { notaQuesito: true },
                    });
                    const notaFinalProvaPratica = (_b = somaQuesitos._sum.notaQuesito) !== null && _b !== void 0 ? _b : 0;
                    yield prisma.avaliacao.update({
                        where: { idAvalicao: avaliacao.idAvalicao },
                        data: { notaFinal: notaFinalProvaPratica },
                    });
                    yield prisma.fichaCandidato.update({
                        where: { idFicha: data.ficha.idFicha },
                        data: {
                            notaFinalProvasPraticas: notaFinalProvaPratica,
                            notaCandidato: { increment: notaFinalProvaPratica },
                        },
                    });
                    return {
                        message: "Avaliação prática criada com sucesso",
                        notaFinalProvaPratica,
                    };
                }));
            }
            catch (error) {
                console.error("Erro ao criar avaliação:", error);
                throw error;
            }
        });
    }
    editarAvaliacao(idAvalicao, avaliadorId, candidatoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avaliacao = yield this.prisma.avaliacao.update({
                    where: { idAvalicao, candidatoId },
                    data: { avaliadorId },
                });
                return avaliacao;
            }
            catch (error) {
                throw new Error(`Erro ao editar avaliação: ${error}`);
            }
        });
    }
    visualizarAvaliacoes(candidatoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avaliacoes = yield this.prisma.avaliacao.findMany({
                    where: { candidatoId },
                });
                return avaliacoes;
            }
            catch (error) {
                throw new Error(`Erro ao visualizar avaliações: ${error}`);
            }
        });
    }
    listarAvaliacoes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avaliacoes = yield this.prisma.avaliacao.findMany();
                return avaliacoes;
            }
            catch (error) {
                throw new Error(`Erro ao listar avaliações: ${error}`);
            }
        });
    }
    buscarEstruturaCompleta(avaliadorId, candidatoId, provasSelecionadas) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const candidato = yield this.prisma.candidato.findUnique({
                where: { idCandidato: candidatoId },
                include: {
                    Categoria: {
                        select: {
                            idCategoria: true,
                            nomeCategoria: true,
                            sorteioDanca: true,
                        },
                    },
                    PreferenciaSorteioDanca: {
                        select: {
                            nomeSorteioDanca: true,
                            dancas: { select: { nomeDanca: true } },
                        },
                    },
                    sorteioDanca: {
                        orderBy: { dataSorteio: "desc" },
                        take: 5,
                        select: {
                            tipoDanca: true,
                            resultadoSorteio: true,
                            dataSorteio: true,
                        },
                    },
                },
            });
            if (!candidato)
                throw new Error("Candidato não encontrado");
            const possuiSorteio = ((_b = (_a = candidato.Categoria) === null || _a === void 0 ? void 0 : _a.sorteioDanca) !== null && _b !== void 0 ? _b : 0) > 1;
            const escolhasSalao = candidato.PreferenciaSorteioDanca
                .filter((p) => p.nomeSorteioDanca === "DANCA_DE_SALAO")
                .flatMap((p) => p.dancas.map((d) => d.nomeDanca));
            const escolhasTradicional = candidato.PreferenciaSorteioDanca
                .filter((p) => p.nomeSorteioDanca === "DANCA_TRADICIONAL")
                .flatMap((p) => p.dancas.map((d) => d.nomeDanca));
            const provaPratica = yield this.prisma.provaPratica.findMany({
                where: Object.assign({ categorias: {
                        some: { idCategoria: candidato.categoriaId },
                    }, comissaoProvaPraticas: {
                        some: {
                            Comissao: {
                                usuarios: {
                                    some: { usuarioId: avaliadorId },
                                },
                            },
                        },
                    } }, ((provasSelecionadas === null || provasSelecionadas === void 0 ? void 0 : provasSelecionadas.length)
                    ? { idProvaPratica: { in: provasSelecionadas } }
                    : {})),
                include: {
                    blocosProvas: {
                        include: {
                            quesitos: {
                                include: {
                                    subQuesitos: true,
                                },
                            },
                        },
                    },
                },
            });
            const [dancasSalao, dancasTrad] = yield Promise.all([
                this.prisma.danca.findMany({
                    where: { dancaSalaoTradicional: client_1.DancaSalaoTradicional.DANCA_DE_SALAO },
                    select: { idDanca: true, nomeDanca: true },
                    orderBy: { idDanca: "asc" },
                }),
                this.prisma.danca.findMany({
                    where: { dancaSalaoTradicional: client_1.DancaSalaoTradicional.DANCA_TRADICIONAL },
                    select: { idDanca: true, nomeDanca: true },
                    orderBy: { idDanca: "asc" },
                }),
            ]);
            const mapSalao = new Map(dancasSalao.map((d) => [d.idDanca, d.nomeDanca]));
            const mapTrad = new Map(dancasTrad.map((d) => [d.idDanca, d.nomeDanca]));
            const resolveNomeDanca = (tipo, resultadoSorteio) => {
                var _a, _b;
                if (!resultadoSorteio || resultadoSorteio <= 0)
                    return null;
                const map = tipo === "DANCA_DE_SALAO" ? mapSalao : mapTrad;
                const lista = tipo === "DANCA_DE_SALAO" ? dancasSalao : dancasTrad;
                const porId = map.get(resultadoSorteio);
                if (porId)
                    return porId;
                const idx = resultadoSorteio - 1;
                return (_b = (_a = lista[idx]) === null || _a === void 0 ? void 0 : _a.nomeDanca) !== null && _b !== void 0 ? _b : null;
            };
            const sorteioSalaoAtual = (_e = (_d = (_c = candidato.sorteioDanca) === null || _c === void 0 ? void 0 : _c.filter((s) => s.tipoDanca === client_1.DancaSalaoTradicional.DANCA_DE_SALAO)) === null || _d === void 0 ? void 0 : _d.sort((a, b) => new Date(b.dataSorteio).getTime() - new Date(a.dataSorteio).getTime())[0]) !== null && _e !== void 0 ? _e : null;
            const sorteioTradAtual = (_h = (_g = (_f = candidato.sorteioDanca) === null || _f === void 0 ? void 0 : _f.filter((s) => s.tipoDanca === client_1.DancaSalaoTradicional.DANCA_TRADICIONAL)) === null || _g === void 0 ? void 0 : _g.sort((a, b) => new Date(b.dataSorteio).getTime() - new Date(a.dataSorteio).getTime())[0]) !== null && _h !== void 0 ? _h : null;
            const nomeSalaoSorteada = possuiSorteio
                ? resolveNomeDanca("DANCA_DE_SALAO", sorteioSalaoAtual === null || sorteioSalaoAtual === void 0 ? void 0 : sorteioSalaoAtual.resultadoSorteio)
                : null;
            const nomeTradSorteada = possuiSorteio
                ? resolveNomeDanca("DANCA_TRADICIONAL", sorteioTradAtual === null || sorteioTradAtual === void 0 ? void 0 : sorteioTradAtual.resultadoSorteio)
                : null;
            const contextoDancas = {
                possuiSorteio,
                salao: {
                    sorteada: nomeSalaoSorteada,
                    escolhidas: !possuiSorteio && escolhasSalao.length ? escolhasSalao : null,
                },
                tradicional: {
                    sorteada: nomeTradSorteada,
                    escolhidas: !possuiSorteio && escolhasTradicional.length ? escolhasTradicional : null,
                },
            };
            const provaPraticaComMeta = provaPratica.map((pp) => (Object.assign(Object.assign({}, pp), { blocosProvas: pp.blocosProvas.map((bloco) => (Object.assign(Object.assign({}, bloco), { quesitos: bloco.quesitos.map((q) => {
                        var _a;
                        const nome = ((_a = q.nomeQuesito) !== null && _a !== void 0 ? _a : "").toLowerCase();
                        const isSalao = nome.includes("dança gaúcha de salão") ||
                            nome.includes("danca gaucha de salao");
                        const isFolclorica = nome.includes("dança folclórica tradicional") ||
                            nome.includes("danca folclorica tradicional");
                        if (!isSalao && !isFolclorica)
                            return q;
                        const tipo = isSalao
                            ? "DANCA_DE_SALAO"
                            : "DANCA_TRADICIONAL";
                        const nomeSorteada = possuiSorteio
                            ? (isSalao ? contextoDancas.salao.sorteada : contextoDancas.tradicional.sorteada)
                            : null;
                        const escolhidas = !possuiSorteio
                            ? (isSalao ? contextoDancas.salao.escolhidas : contextoDancas.tradicional.escolhidas)
                            : null;
                        const textoExibicao = possuiSorteio
                            ? nomeSorteada
                                ? `Dança sorteada: ${nomeSorteada}`
                                : "Dança sorteada: (não realizada)"
                            : (escolhidas === null || escolhidas === void 0 ? void 0 : escolhidas.length)
                                ? `Dança escolhida: ${escolhidas.join(", ")}`
                                : "Dança escolhida: (não informada)";
                        const metaDanca = {
                            tipo,
                            possuiSorteio,
                            sorteada: nomeSorteada,
                            escolhidas,
                            textoExibicao,
                        };
                        return Object.assign(Object.assign({}, q), { metaDanca });
                    }) }))) })));
            return {
                provaPratica: provaPraticaComMeta,
                contextoDancas,
            };
        });
    }
    criarAvaliacaoTeorica(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                const avaliacao = yield prisma.avaliacao.create({
                    data: {
                        candidatoId: data.candidatoId,
                        avaliadorId: data.avaliadorId,
                        provaTeoricaId: data.provaTeoricaId,
                        fichaCandidatoIdFicha: data.ficha.idFicha,
                        notaFinal: 0,
                    },
                });
                for (const quesito of data.quesitos) {
                    let notaQuesitoFinal = (_a = quesito.notaQuesito) !== null && _a !== void 0 ? _a : 0;
                    const avaliacaoQuesito = yield prisma.avaliacaoQuesito.create({
                        data: {
                            avaliacaoId: avaliacao.idAvalicao,
                            quesitoId: quesito.quesitoId,
                            notaQuesito: notaQuesitoFinal,
                            comentario: (_b = quesito.comentario) !== null && _b !== void 0 ? _b : null,
                        },
                    });
                    if ((_c = quesito.subQuesitos) === null || _c === void 0 ? void 0 : _c.length) {
                        notaQuesitoFinal = 0;
                        for (const sub of quesito.subQuesitos) {
                            notaQuesitoFinal += sub.notaSubQuesito;
                            yield prisma.avaliacaoSubQuesito.create({
                                data: {
                                    avaliacaoQuesitoId: avaliacaoQuesito.idAvaliacaoQuesito,
                                    subQuesitoId: sub.subQuesitoId,
                                    notaSubQuesito: sub.notaSubQuesito,
                                },
                            });
                        }
                        yield prisma.avaliacaoQuesito.update({
                            where: { idAvaliacaoQuesito: avaliacaoQuesito.idAvaliacaoQuesito },
                            data: {
                                notaQuesito: notaQuesitoFinal,
                                comentario: (_d = quesito.comentario) !== null && _d !== void 0 ? _d : null,
                            },
                        });
                    }
                }
                const somaQuesitos = yield prisma.avaliacaoQuesito.aggregate({
                    where: { avaliacaoId: avaliacao.idAvalicao },
                    _sum: { notaQuesito: true },
                });
                const notaFinalProvaTeorica = (_e = somaQuesitos._sum.notaQuesito) !== null && _e !== void 0 ? _e : 0;
                yield prisma.avaliacao.update({
                    where: { idAvalicao: avaliacao.idAvalicao },
                    data: { notaFinal: notaFinalProvaTeorica },
                });
                yield prisma.fichaCandidato.update({
                    where: { idFicha: data.ficha.idFicha },
                    data: {
                        notaFinalProvaTeorica: notaFinalProvaTeorica,
                        notaCandidato: { increment: notaFinalProvaTeorica },
                        anexoGabarito: data.ficha.anexoGabarito
                            ? new Uint8Array(data.ficha.anexoGabarito)
                            : undefined,
                        anexoRedacao: data.ficha.anexoRedacao
                            ? new Uint8Array(data.ficha.anexoRedacao)
                            : undefined,
                    },
                });
                return {
                    message: "Avaliação teórica criada com sucesso",
                    notaFinalProvaTeorica,
                };
            }));
        });
    }
    buscarEstruturaTeorica(candidatoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidato = yield this.prisma.candidato.findUnique({
                where: { idCandidato: candidatoId },
                include: { Categoria: true },
            });
            if (!candidato)
                throw new Error("Candidato não encontrado");
            const provasTeoricas = yield this.prisma.provaTeorica.findMany({
                where: {
                    categorias: {
                        some: {
                            idCategoria: candidato.categoriaId
                        },
                    },
                },
                include: {
                    quesitos: {
                        include: {
                            subQuesitos: true,
                        },
                    },
                },
            });
            return provasTeoricas;
        });
    }
}
exports.AvaliacaoService = AvaliacaoService;
const avaliacao = new AvaliacaoService(prisma);
exports.default = avaliacao;
