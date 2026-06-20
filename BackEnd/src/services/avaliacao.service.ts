import { AvaliacaoSubQuesito, DancaSalaoTradicional, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AvaliacaoService {
    constructor(protected prisma: PrismaClient) { }

    async criarAvaliacaoCompleta(data: CriarAvaliacaoCompletaDTO) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const avaliacaoExistente = await prisma.avaliacao.findFirst({
                    where: {
                        avaliadorId: data.avaliadorId,
                        candidatoId: data.candidatoId,
                        blocoProvaId: data.blocoProvaId,
                    },
                });

                if (avaliacaoExistente) {
                    throw new Error("Já existe uma avaliação cadastrada para este avaliador e candidato.");
                }

                const avaliacao = await prisma.avaliacao.create({
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

                    const avaliacaoQuesito = await prisma.avaliacaoQuesito.create({
                        data: {
                            avaliacaoId: avaliacao.idAvalicao,
                            quesitoId: quesito.quesitoId,
                            comentario: quesito.comentario ?? null,
                            notaQuesito,
                        },
                    });

                    for (const sub of quesito.subQuesitos) {
                        await prisma.avaliacaoSubQuesito.create({
                            data: {
                                avaliacaoQuesitoId: avaliacaoQuesito.idAvaliacaoQuesito,
                                subQuesitoId: sub.subQuesitoId,
                                notaSubQuesito: sub.notaSubQuesito,
                            },
                        });
                    }
                }

                const somaQuesitos = await prisma.avaliacaoQuesito.aggregate({
                    where: { avaliacaoId: avaliacao.idAvalicao },
                    _sum: { notaQuesito: true },
                });

                const notaFinalProvaPratica = somaQuesitos._sum.notaQuesito ?? 0;

                await prisma.avaliacao.update({
                    where: { idAvalicao: avaliacao.idAvalicao },
                    data: { notaFinal: notaFinalProvaPratica },
                });

                await prisma.fichaCandidato.update({
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
            });
        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            throw error;
        }
    }

    async editarAvaliacao(
        idAvalicao: number,
        avaliadorId: number,
        candidatoId: number,
    ) {
        try {
            const avaliacao = await this.prisma.avaliacao.update({
                where: { idAvalicao, candidatoId },
                data: { avaliadorId },
            });
            return avaliacao;
        } catch (error) {
            throw new Error(`Erro ao editar avaliação: ${error}`);
        }
    }

    async visualizarAvaliacoes(
        candidatoId: number,
    ) {
        try {
            const avaliacoes = await this.prisma.avaliacao.findMany({
                where: { candidatoId },
            });
            return avaliacoes;
        } catch (error) {
            throw new Error(`Erro ao visualizar avaliações: ${error}`);
        }
    }

    async listarAvaliacoes() {
        try {
            const avaliacoes = await this.prisma.avaliacao.findMany();
            return avaliacoes;
        } catch (error) {
            throw new Error(`Erro ao listar avaliações: ${error}`);
        }
    }

    async buscarEstruturaCompleta(
        avaliadorId: number,
        candidatoId: number,
        provasSelecionadas?: number[]
    ) {
        const candidato = await this.prisma.candidato.findUnique({
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

        if (!candidato) throw new Error("Candidato não encontrado");

        /**
         * ======================================================
         * ✅ REGRA CORRETA
         * 0 ou 1 = NÃO tem sorteio (só preferência)
         * 2+     = tem sorteio
         * ======================================================
         */
        const possuiSorteio = (candidato.Categoria?.sorteioDanca ?? 0) > 1;

        /**
         * ======================================================
         * 🎵 PREFERÊNCIAS (SEMPRE)
         * ======================================================
         */
        const escolhasSalao = candidato.PreferenciaSorteioDanca
            .filter((p) => p.nomeSorteioDanca === "DANCA_DE_SALAO")
            .flatMap((p) => p.dancas.map((d) => d.nomeDanca));

        const escolhasTradicional = candidato.PreferenciaSorteioDanca
            .filter((p) => p.nomeSorteioDanca === "DANCA_TRADICIONAL")
            .flatMap((p) => p.dancas.map((d) => d.nomeDanca));

        /**
         * ======================================================
         * 📋 PROVAS / BLOCOS / QUESITOS
         * ======================================================
         */
        
        // 1️⃣ Busca todas as atribuições que as comissões deste avaliador possuem
        const comissoesDoAvaliador = await this.prisma.comissaoUsuario.findMany({
            where: { usuarioId: avaliadorId },
            include: { Comissao: { include: { atribuicoes: true } } }
        });
        const atribuicoes = comissoesDoAvaliador.flatMap(c => c.Comissao?.atribuicoes || []);

        // 2️⃣ Busca as provas práticas da categoria do candidato (sem o filtro restrito do Prisma)
        let provaPratica = await this.prisma.provaPratica.findMany({
            where: {
                categorias: {
                    some: { idCategoria: candidato.categoriaId },
                },
                ...(provasSelecionadas?.length
                    ? { idProvaPratica: { in: provasSelecionadas } }
                    : {}),
            },
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

        // 3️⃣ Filtra as Provas e Blocos de acordo com as atribuições liberadas para a comissão
        provaPratica = provaPratica
            .map(prova => {
                // Tem acesso total se a atribuição for geral da Categoria OU geral desta Prova
                const temAcessoTotalProva = atribuicoes.some(a => 
                    (a.categoriaId === candidato.categoriaId && !a.provaPraticaId && !a.blocoProvaId) ||
                    (a.provaPraticaId === prova.idProvaPratica && !a.blocoProvaId)
                );

                // Filtra os blocos e quesitos:
                const blocosFiltrados = prova.blocosProvas
                    .map(bloco => {
                        const temAcessoTotalBloco = temAcessoTotalProva || atribuicoes.some(a => a.blocoProvaId === bloco.idBloco);
                        
                        const quesitosFiltrados = bloco.quesitos.filter(quesito => 
                            temAcessoTotalBloco
                        );

                        return quesitosFiltrados.length > 0 ? {
                            ...bloco,
                            quesitos: quesitosFiltrados
                        } : null;
                    })
                    .filter((bloco): bloco is typeof prova.blocosProvas[0] => bloco !== null);

                return blocosFiltrados.length > 0 ? {
                    ...prova,
                    blocosProvas: blocosFiltrados
                } : null;
            })
            .filter((prova): prova is typeof provaPratica[0] => prova !== null);

        /**
         * ======================================================
         * 🧠 LISTAS DE DANÇAS (1x)
         * ======================================================
         */
        const [dancasSalao, dancasTrad] = await Promise.all([
            this.prisma.danca.findMany({
                where: { dancaSalaoTradicional: DancaSalaoTradicional.DANCA_DE_SALAO },
                select: { idDanca: true, nomeDanca: true },
                orderBy: { idDanca: "asc" },
            }),
            this.prisma.danca.findMany({
                where: { dancaSalaoTradicional: DancaSalaoTradicional.DANCA_TRADICIONAL },
                select: { idDanca: true, nomeDanca: true },
                orderBy: { idDanca: "asc" },
            }),
        ]);

        const mapSalao = new Map<number, string>(dancasSalao.map((d) => [d.idDanca, d.nomeDanca]));
        const mapTrad = new Map<number, string>(dancasTrad.map((d) => [d.idDanca, d.nomeDanca]));

        const resolveNomeDanca = (
            tipo: "DANCA_DE_SALAO" | "DANCA_TRADICIONAL",
            resultadoSorteio: number | null | undefined
        ) => {
            if (!resultadoSorteio || resultadoSorteio <= 0) return null;

            const map = tipo === "DANCA_DE_SALAO" ? mapSalao : mapTrad;
            const lista = tipo === "DANCA_DE_SALAO" ? dancasSalao : dancasTrad;

            // 1) tenta como idDanca
            const porId = map.get(resultadoSorteio);
            if (porId) return porId;

            // 2) fallback: posição 1..N
            const idx = resultadoSorteio - 1;
            return lista[idx]?.nomeDanca ?? null;
        };

        /**
         * ======================================================
         * 🎲 PEGA O SORTEIO MAIS RECENTE (POR TIPO)
         * ======================================================
         */
        const sorteioSalaoAtual =
            candidato.sorteioDanca
                ?.filter((s) => s.tipoDanca === DancaSalaoTradicional.DANCA_DE_SALAO)
                ?.sort((a, b) => new Date(b.dataSorteio).getTime() - new Date(a.dataSorteio).getTime())[0] ?? null;

        const sorteioTradAtual =
            candidato.sorteioDanca
                ?.filter((s) => s.tipoDanca === DancaSalaoTradicional.DANCA_TRADICIONAL)
                ?.sort((a, b) => new Date(b.dataSorteio).getTime() - new Date(a.dataSorteio).getTime())[0] ?? null;

        /**
         * ======================================================
         * ✅ CONTEXTO DAS DANÇAS (COM NOME)
         * ======================================================
         */
        const nomeSalaoSorteada = possuiSorteio
            ? resolveNomeDanca("DANCA_DE_SALAO", sorteioSalaoAtual?.resultadoSorteio)
            : null;

        const nomeTradSorteada = possuiSorteio
            ? resolveNomeDanca("DANCA_TRADICIONAL", sorteioTradAtual?.resultadoSorteio)
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

        /**
         * ======================================================
         * ✅ INJETAR metaDanca nos quesitos de DANÇA
         * ======================================================
         */
        const provaPraticaComMeta = provaPratica.map((pp) => ({
            ...pp,
            blocosProvas: pp.blocosProvas.map((bloco) => ({
                ...bloco,
                quesitos: bloco.quesitos.map((q) => {
                    const nome = (q.nomeQuesito ?? "").toLowerCase();

                    const isSalao =
                        nome.includes("dança gaúcha de salão") ||
                        nome.includes("danca gaucha de salao");

                    const isFolclorica =
                        nome.includes("dança folclórica tradicional") ||
                        nome.includes("danca folclorica tradicional");

                    if (!isSalao && !isFolclorica) return q;

                    const tipo: "DANCA_DE_SALAO" | "DANCA_TRADICIONAL" = isSalao
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
                        : escolhidas?.length
                            ? `Dança escolhida: ${escolhidas.join(", ")}`
                            : "Dança escolhida: (não informada)";

                    const metaDanca = {
                        tipo,
                        possuiSorteio,
                        sorteada: nomeSorteada,
                        escolhidas,
                        textoExibicao,
                    };

                    return { ...q, metaDanca };
                }),
            })),
        }));

        console.dir(
            { possuiSorteio, contextoDancas, provaPraticaComMeta },
            { depth: null, colors: true }
        );

        return {
            provaPratica: provaPraticaComMeta,
            contextoDancas,
        };
    }

    async criarAvaliacaoTeorica(data: CriarAvaliacaoTeoricaDTO) {
        return this.prisma.$transaction(async (prisma) => {
            const avaliacao = await prisma.avaliacao.create({
                data: {
                    candidatoId: data.candidatoId,
                    avaliadorId: data.avaliadorId,
                    provaTeoricaId: data.provaTeoricaId,
                    fichaCandidatoIdFicha: data.ficha.idFicha,
                    notaFinal: 0,
                },
            });

            for (const quesito of data.quesitos) {
                let notaQuesitoFinal = quesito.notaQuesito ?? 0;

                const avaliacaoQuesito = await prisma.avaliacaoQuesito.create({
                    data: {
                        avaliacaoId: avaliacao.idAvalicao,
                        quesitoId: quesito.quesitoId,
                        notaQuesito: notaQuesitoFinal,
                        comentario: quesito.comentario ?? null,
                    },
                });

                if (quesito.subQuesitos?.length) {
                    notaQuesitoFinal = 0;

                    for (const sub of quesito.subQuesitos) {
                        notaQuesitoFinal += sub.notaSubQuesito;

                        await prisma.avaliacaoSubQuesito.create({
                            data: {
                                avaliacaoQuesitoId: avaliacaoQuesito.idAvaliacaoQuesito,
                                subQuesitoId: sub.subQuesitoId,
                                notaSubQuesito: sub.notaSubQuesito,
                            },
                        });
                    }

                    await prisma.avaliacaoQuesito.update({
                        where: { idAvaliacaoQuesito: avaliacaoQuesito.idAvaliacaoQuesito },
                        data: {
                            notaQuesito: notaQuesitoFinal,
                            comentario: quesito.comentario ?? null,
                        },
                    });
                }
            }

            const somaQuesitos = await prisma.avaliacaoQuesito.aggregate({
                where: { avaliacaoId: avaliacao.idAvalicao },
                _sum: { notaQuesito: true },
            });

            const notaFinalProvaTeorica = somaQuesitos._sum.notaQuesito ?? 0;

            await prisma.avaliacao.update({
                where: { idAvalicao: avaliacao.idAvalicao },
                data: { notaFinal: notaFinalProvaTeorica },
            });

            await prisma.fichaCandidato.update({
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
        });
    }

    async buscarEstruturaTeorica(candidatoId: number) {
        const candidato = await this.prisma.candidato.findUnique({
            where: { idCandidato: candidatoId },
            include: { Categoria: true },
        });

        if (!candidato) throw new Error("Candidato não encontrado");

        const provasTeoricas = await this.prisma.provaTeorica.findMany({
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
    }

    async editarAvaliacaoTeorica(
        idAvalicao: number,
        avaliadorId: number,
        candidatoId: number,
    ) {
        try {
            const avaliacao = await this.prisma.avaliacao.update({
                where: { idAvalicao, candidatoId },
                data: { avaliadorId },
            });
            return avaliacao;
        } catch (error) {
            throw new Error(`Erro ao editar avaliação teórica: ${error}`);
        }
    }

    async editarAvaliacaoCompleta(data: EditarAvaliacaoCompletaDTO) {
        const {
            idAvalicao,
            comissaoId,
            avaliadorId,
            candidatoId,
            blocoProvaId,
            provaPraticaId,
            quesitos,
            ficha,
        } = data;

        if (
            !idAvalicao ||
            !comissaoId ||
            !avaliadorId ||
            !candidatoId ||
            !blocoProvaId ||
            !provaPraticaId ||
            !Array.isArray(quesitos) ||
            !ficha
        ) {
            throw new Error("Dados obrigatórios não informados");
        }

        return this.prisma.$transaction(async (prisma) => {
            const avaliacaoExistente = await prisma.avaliacao.findUnique({
                where: { idAvalicao },
            });

            if (
                !avaliacaoExistente ||
                avaliacaoExistente.avaliadorId !== avaliadorId ||
                avaliacaoExistente.candidatoId !== candidatoId
            ) {
                throw new Error("Avaliação prática não encontrada para esse candidato/avaliador.");
            }

            const notaFinalAntiga = avaliacaoExistente.notaFinal ?? 0;

            for (const quesito of quesitos) {
                const avaliacaoQuesito = await prisma.avaliacaoQuesito.upsert({
                    where: {
                        avaliacaoId_quesitoId: {
                            avaliacaoId: idAvalicao,
                            quesitoId: quesito.quesitoId,
                        },
                    },
                    create: {
                        avaliacaoId: idAvalicao,
                        quesitoId: quesito.quesitoId,
                        comentario: quesito.comentario ?? null,
                        notaQuesito: 0,
                    },
                    update: {
                        comentario: quesito.comentario ?? null,
                        notaQuesito: 0,
                    },
                });

                let notaQuesito = 0;

                for (const sub of quesito.subQuesitos) {
                    notaQuesito += sub.notaSubQuesito;

                    await prisma.avaliacaoSubQuesito.upsert({
                        where: {
                            avaliacaoQuesitoId_subQuesitoId: {
                                avaliacaoQuesitoId: avaliacaoQuesito.idAvaliacaoQuesito,
                                subQuesitoId: sub.subQuesitoId,
                            },
                        },
                        create: {
                            avaliacaoQuesitoId: avaliacaoQuesito.idAvaliacaoQuesito,
                            subQuesitoId: sub.subQuesitoId,
                            notaSubQuesito: sub.notaSubQuesito,
                        },
                        update: {
                            notaSubQuesito: sub.notaSubQuesito,
                        },
                    });
                }

                await prisma.avaliacaoQuesito.update({
                    where: { idAvaliacaoQuesito: avaliacaoQuesito.idAvaliacaoQuesito },
                    data: { notaQuesito },
                });
            }

            const somaQuesitos = await prisma.avaliacaoQuesito.aggregate({
                where: { avaliacaoId: idAvalicao },
                _sum: { notaQuesito: true },
            });

            const notaFinalProvaPratica = somaQuesitos._sum.notaQuesito ?? 0;

            await prisma.avaliacao.update({
                where: { idAvalicao },
                data: { notaFinal: notaFinalProvaPratica },
            });

            const diferenca = notaFinalProvaPratica - notaFinalAntiga;

            await prisma.fichaCandidato.update({
                where: { idFicha: ficha.idFicha },
                data: {
                    notaFinalProvasPraticas: notaFinalProvaPratica,
                    notaCandidato: { increment: diferenca },
                },
            });

            return {
                message: "Avaliação prática atualizada com sucesso",
                notaFinalProvaPratica,
            };
        });
    }

    async listarAvaliacoesCompletasPorCandidatoAvaliador(candidatoId: number, avaliadorId: number) {
        try {
            const avaliacoes = await this.prisma.avaliacao.findMany({
                where: {
                    candidatoId,
                    avaliadorId,
                    provaPraticaId: { not: null },
                },
                include: {
                    quesitosAvaliados: {
                        include: {
                            subQuesitosAvaliados: true,
                        },
                    },
                },
            });
            return avaliacoes;
        } catch (error) {
            throw new Error(`Erro ao listar avaliações completas por candidato e avaliador: ${error}`);
        }
    }
}

type EditarAvaliacaoCompletaDTO = CriarAvaliacaoCompletaDTO & {
    idAvalicao: number;
};

type CriarAvaliacaoCompletaDTO = {
    comissaoId: number
    avaliadorId: number
    candidatoId: number
    provaPraticaId: number
    blocoProvaId?: number
    quesitos: {
        quesitoId: number
        comentario?: string
        subQuesitos: {
            subQuesitoId: number
            notaSubQuesito: number
        }[]
    }[];

    ficha: {
        idFicha: number;
        concursoId: number;
        notaCandidato: number;
        notaFinalProvasPraticas: number;
    };
}

type CriarAvaliacaoTeoricaDTO = {
    candidatoId: number;
    avaliadorId: number;
    provaTeoricaId: number;

    quesitos: {
        quesitoId: number;
        notaQuesito: number;
        comentario?: string;
        subQuesitos?: {
            subQuesitoId: number;
            notaSubQuesito: number;
        }[];
    }[];

    ficha: {
        idFicha: number;
        concursoId: number;
        notaCandidato: number;
        notaFinalProvaTeorica: number;
        anexoGabarito?: Buffer;
        anexoRedacao?: Buffer;
    };
}

const avaliacao = new AvaliacaoService(prisma);
export default avaliacao;