import { PrismaClient, FichaCandidato, SubQuesitos, Avaliacao, AvaliacaoQuesito, BlocoProva } from "@prisma/client";

const prisma = new PrismaClient();

export class RelatoriosService {
    constructor(protected prisma: PrismaClient) { }

    async relatorioGeralPorConcurso(
        concursoId: number
    ): Promise<RelatorioGeralCandidatoDTO[]> {

        const fichas = await prisma.fichaCandidato.findMany({
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

        return fichas.map((ficha) => ({
            candidatoId: ficha.candidatoId,
            nomeCandidato: ficha.Candidato.nomeCompleto,
            categoria: ficha.Candidato.Categoria.nomeCategoria,
            concurso: ficha.Concurso.nomeConcurso,
            notaProvaTeorica: ficha.notaFinalProvaTeorica ?? 0,
            notaProvasPraticas: ficha.notaFinalProvasPraticas ?? 0,
            notaFinal: ficha.notaCandidato ?? 0,
        }));
    }

    async rankingPorCategoria(
        concursoId: number,
        categoriaId: number
    ): Promise<RelatorioAvaliacaoDTO[]> {

        const fichas = await prisma.fichaCandidato.findMany({
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
        let ultimaNota: number | null = null;

        return fichas.map((ficha, index) => {
            if (ultimaNota !== ficha.notaCandidato) {
                classificacao = index + 1;
                ultimaNota = ficha.notaCandidato;
            }

            return {
                candidatoId: ficha.candidatoId,
                nomeCandidato: ficha.Candidato.nomeCompleto,
                concurso: ficha.Concurso.nomeConcurso,
                categoria: ficha.Candidato.Categoria.nomeCategoria,
                notaFinal: ficha.notaCandidato ?? 0,
                classificacao,
            };
        });
    }

    async gerarRelatorioIndividualDetalhado(candidatoId: number) {
        const avaliacoes = await prisma.avaliacao.findMany({
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

        const avaliadoresMap = new Map<
            number,
            {
                nomeAvaliador: string;
                blocos: Map<
                    number,
                    {
                        nomeBloco: string;
                        quesitos: Map<
                            number,
                            {
                                nomeQuesito: string;
                                notaQuesito: number;
                                comentario: string | null;
                                subquesitos: {
                                    nomeSubQuesito: string;
                                    nota: number;
                                    subGrupo: any | null; 
                                }[];
                            }
                        >;
                        totalBloco: number;
                    }
                >;
                totalAvaliador: number;
            }
        >();

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

                const avaliador = avaliadoresMap.get(idAvaliador)!;

                if (!avaliador.blocos.has(avaliacao.provaTeoricaId)) {
                    avaliador.blocos.set(avaliacao.provaTeoricaId, {
                        nomeBloco: "Prova Teórica",
                        quesitos: new Map(),
                        totalBloco: 0,
                    });
                }

                const blocoMap = avaliador.blocos.get(avaliacao.provaTeoricaId)!;

                for (const aq of avaliacao.quesitosAvaliados) {
                    const subquesitos =
                        aq.subQuesitosAvaliados
                            ?.filter(
                                (sq) => sq.notaSubQuesito !== null && sq.notaSubQuesito !== 0
                            )
                            .map((sq) => ({
                                nomeSubQuesito: sq.SubQuesito?.nomeSubquesito ?? "",
                                nota: sq.notaSubQuesito as number,
                                subGrupo: sq.SubQuesito?.subGrupo ?? null,
                            })) ?? [];

                    const temNota = aq.notaQuesito !== null && aq.notaQuesito !== 0;

                    if (!temNota && subquesitos.length === 0) continue;

                    blocoMap.quesitos.set(aq.Quesito.idQuesito, {
                        nomeQuesito: aq.Quesito.nomeQuesito,
                        notaQuesito: (aq.notaQuesito ?? 0) as number,
                        comentario: aq.comentario?.trim() ? aq.comentario : null,
                        subquesitos,
                    });
                    
                    blocoMap.totalBloco += (aq.notaQuesito ?? 0) as number;
                    avaliador.totalAvaliador += (aq.notaQuesito ?? 0) as number;
                    totalFinal += (aq.notaQuesito ?? 0) as number;
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

            const avaliador = avaliadoresMap.get(idAvaliador)!;

            for (const aq of avaliacao.quesitosAvaliados) {
                const quesito = aq.Quesito;
                const bloco = quesito?.BlocoProva;
                if (!quesito || !bloco) continue;

                // ✅ Aceita negativos e ignora 0 (para não listar "não avaliado")
                const subquesitos =
                    aq.subQuesitosAvaliados
                        ?.filter((sq) => sq.notaSubQuesito !== null && sq.notaSubQuesito !== 0)
                        .map((sq) => ({
                            nomeSubQuesito: sq.SubQuesito?.nomeSubquesito ?? "",
                            nota: sq.notaSubQuesito as number,
                            subGrupo: sq.SubQuesito?.subGrupo ?? null,
                        })) ?? [];

                // ✅ Aceita negativos; 0 significa "não avaliado"
                const temNota = aq.notaQuesito !== null && aq.notaQuesito !== 0;

                // ✅ não entra no relatório se não tiver nada avaliado
                if (!temNota && subquesitos.length === 0) continue;

                if (!avaliador.blocos.has(bloco.idBloco)) {
                    avaliador.blocos.set(bloco.idBloco, {
                        nomeBloco: bloco.nomeBloco,
                        quesitos: new Map(),
                        totalBloco: 0,
                    });
                }

                const blocoMap = avaliador.blocos.get(bloco.idBloco)!;

                blocoMap.quesitos.set(quesito.idQuesito, {
                    nomeQuesito: quesito.nomeQuesito,
                    notaQuesito: (aq.notaQuesito ?? 0) as number,
                    comentario: aq.comentario?.trim() ? aq.comentario : null,
                    subquesitos,
                });

                // ✅ soma negativos normalmente
                blocoMap.totalBloco += (aq.notaQuesito ?? 0) as number;
                avaliador.totalAvaliador += (aq.notaQuesito ?? 0) as number;
                totalFinal += (aq.notaQuesito ?? 0) as number;
            }
        }

        /**
         * ======================================================
         * 🔹 DADOS DO CANDIDATO
         * ======================================================
         */
        const ficha = await prisma.fichaCandidato.findUnique({
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
            nomeCandidato: ficha?.Candidato.nomeCompleto,
            categoria: ficha?.Candidato.Categoria.nomeCategoria,
            concurso: ficha?.Concurso.nomeConcurso,
            notaCandidato: ficha?.notaCandidato,
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
                            quesitos: Array.from(bl.quesitos.values()).sort((a, b) =>
                                a.nomeQuesito.localeCompare(b.nomeQuesito)
                            ),
                            totalBloco: bl.totalBloco,
                        })),
                    totalAvaliador: av.totalAvaliador,
                })),
            totalFinal,
        };
    }

    async gerarRelatorioPorCategoriaConcurso(
        categoriaId: number,
        concursoIdConcurso: number
    ): Promise<(CandidatoResumo & { posicao: number })[]> {

        const candidatos = await prisma.candidato.findMany({
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

        const relatorio: CandidatoResumo[] = candidatos.map((c) => {
            const ficha = c.fichaCandidato;

            // 🔹 NOTAS OFICIAIS (VÊM DA FICHA)
            const notaTeorica = ficha?.notaFinalProvaTeorica ?? 0;
            const notaPratica = ficha?.notaFinalProvasPraticas ?? 0;
            const notaFinal = ficha?.notaCandidato ?? (notaTeorica + notaPratica);

            // 🔹 DETALHAMENTO POR AVALIADOR
            const mapaAvaliadores = new Map<number, AvaliadorResumo>();

            (c.avalicoes ?? []).forEach((av) => {
                if (!av.avaliadorId) return;

                const idAvaliador = av.avaliadorId;
                const nomeAvaliador = av.Usuario?.nomeCompleto ?? "Avaliador";

                const nomeBloco =
                    av.BlocoProva?.nomeBloco ??
                    av.ProvaPratica?.nomeProva ??
                    "Bloco";

                // ✅ NOTA FINAL JÁ CONSOLIDADA DA AVALIAÇÃO
                const notaBloco = Number(av.notaFinal ?? 0);

                if (!mapaAvaliadores.has(idAvaliador)) {
                    mapaAvaliadores.set(idAvaliador, {
                        nomeAvaliador,
                        blocos: [],
                        totalAvaliador: 0
                    });
                }

                const avaliador = mapaAvaliadores.get(idAvaliador)!;

                avaliador.blocos.push({
                    nomeBloco,
                    notaFinalBloco: notaBloco
                });

                avaliador.totalAvaliador += notaBloco;
            });

            return {
                candidatoId: c.idCandidato,
                nomeCandidato: c.nomeCompleto,
                CTG: c.CTG?.nomeCTG ?? "",
                categoria: c.Categoria?.nomeCategoria ?? "",
                concurso: c.Concurso?.nomeConcurso ?? "",
                notaProvaTeorica: notaTeorica,
                notaProvasPraticas: notaPratica,
                notaFinal,
                avaliadores: Array.from(mapaAvaliadores.values())
            };
        });

        // 🔹 ORDENAÇÃO E CLASSIFICAÇÃO
        const ordenado = relatorio.sort((a, b) => b.notaFinal - a.notaFinal);

        return ordenado.map((c, idx) => ({
            ...c,
            posicao: idx + 1
        }));
    }


}

const relatorios = new RelatoriosService(prisma);
export default relatorios;

interface RelatorioAvaliacaoDTO {
    candidatoId: number;
    nomeCandidato: string;
    concurso: string;
    categoria: string;
    notaFinal: number;
    classificacao: number;
}

export interface RelatorioIndividualDTO {
    candidatoId: number;
    avaliadores: {
        nomeAvaliador: string;
        blocos: {
            nomeBloco: string;
            quesitos: {
                nomeQuesito: string;
                notaQuesito: number;
                comentario: string | null;
                subquesitos: {
                    nomeSubQuesito: string;
                    nota: number;
                }[];
            }[];
            totalBloco: number;
        }[];
        totalAvaliador: number;
    }[];
    totalFinal: number;
}

export interface RelatorioGeralCandidatoDTO {
    candidatoId: number;
    nomeCandidato: string;
    categoria: string;
    concurso: string;
    notaProvaTeorica: number;
    notaProvasPraticas: number;
    notaFinal: number;
}

export interface BlocoResumo {
    nomeBloco: string;
    notaFinalBloco: number;
}

export interface AvaliadorResumo {
    nomeAvaliador: string;
    blocos: BlocoResumo[];
    totalAvaliador: number;
}

export interface CandidatoResumo {
    candidatoId: number;
    nomeCandidato: string;
    CTG: string;
    categoria: string;
    concurso: string;
    notaProvaTeorica: number;
    notaProvasPraticas: number;
    notaFinal: number;
    avaliadores: AvaliadorResumo[];
}