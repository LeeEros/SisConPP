import { PrismaClient, StatusRecurso } from "@prisma/client";

const prisma = new PrismaClient;

class RecursoServie {
    constructor(protected prisma: PrismaClient) { }

    async solicitarRecurso(
        nomeRecurso: string,
        justificativa: string,
        arquivo: Buffer,
        candidatoId: number,
        avaliadorId: number,
        quesitoRecurso: number,
        avaliacaoId?: number,
        provaTeoricaIdprovaTeorica?: number,
        provaPraticaIdProvaPratica?: number
    ) {
        try {
            const data: any = {
                nomeRecurso,
                justificativa,
                dataRecurso: new Date(),
                status: StatusRecurso.PENDENTE,
                arquivos: new Uint8Array(arquivo),

                Candidato: { connect: { idCandidato: candidatoId } },
                Usuario: { connect: { idUsuario: avaliadorId } },
                Quesito: { connect: { idQuesito: quesitoRecurso } },

                // Se Avaliacao for obrigatória no schema, NÃO pode ser undefined (ver observação abaixo)
                Avaliacao: {
                    connect: { idAvalicao: avaliacaoId! }
                },

                ProvaPratica: provaPraticaIdProvaPratica
                    ? { connect: { idProvaPratica: provaPraticaIdProvaPratica } }
                    : undefined,

                ProvaTeorica: provaTeoricaIdprovaTeorica
                    ? { connect: { idprovaTeorica: provaTeoricaIdprovaTeorica } }
                    : undefined,
            };

            return this.prisma.recurso.create({ data });


        } catch (error) {
            console.error("Erro ao criar recurso:", error);
            throw new Error("Erro ao criar recurso.");
        }
    }

    async listarRecursos() {
        try {
            const recursos = await this.prisma.recurso.findMany({
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
        } catch (error) {
            console.error("Erro ao listar recursos:", error);
            throw new Error("Erro ao listar recursos.");
        }
    }

    async visualizarRecursoPorId(idRecurso: number) {
        try {
            const recurso = await this.prisma.recurso.findUnique({
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
        } catch (error) {
            console.error("Erro ao visualizar recurso:", error);
            throw new Error("Erro ao visualizar recurso.");
        }
    }

    async alterarStatusRecurso(
        idRecurso: number,
        status: StatusRecurso
    ) {
        try {
            const recurso = await this.prisma.recurso.update({
                where: { idRecurso },
                data: {
                    status
                }    
            });
            console.log(status);
            return recurso;
        } catch (error) {
            console.error("Erro ao alterar status do recurso:", error);
            throw new Error("Erro ao alterar status do recurso.");
        }
    }

    async listarQuesitosAvaliadosPorCandidatoEAvaliador(candidatoId: number, avaliadorId: number) {
        const rows = await this.prisma.avaliacaoQuesito.findMany({
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

        const map = new Map<number, any>();
        for (const r of rows) {
            const id = r.Quesito?.idQuesito ?? r.quesitoId;
            if (!map.has(id)) {
                map.set(id, {
                    idQuesito: r.Quesito?.idQuesito ?? r.quesitoId,
                    nomeQuesito: r.Quesito?.nomeQuesito ?? "Quesito",
                    notaMaximaQuesito: r.Quesito?.notaMaximaQuesito ?? null,
                    opcional: r.Quesito?.opcional ?? null,
                    notaQuesito: r.notaQuesito,
                    comentario: r.comentario,
                });
            }
        }

        return Array.from(map.values());
    }
}

const recursoService = new RecursoServie(prisma);
export default recursoService;