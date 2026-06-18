import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class BlocoProvaService {
    constructor(protected prisma: PrismaClient) { }

    async criarBlocoProva(
        nomeBloco: string,
        notaMaximaBloco: number,
        provaPraticaId: number
    ) {
        try {
            const blocoProva = await this.prisma.blocoProva.create({
                data: {
                    nomeBloco,
                    notaMaximaBloco,
                    provaPraticaId
                }
            });
            return blocoProva;
        } catch (error) {
            console.error("Erro ao criar bloco de prova:", error);
            throw new Error("Erro ao criar bloco de prova. Verifique os dados fornecidos.");
        }
    }

    async editarBlocoProva(
        idBloco: number,
        nomeBloco: string,
        notaMaximaBloco: number,
        provaPraticaId: number
    ) {
        try {
            const blocoProva = await this.prisma.blocoProva.update({
                where: { idBloco },
                data: {
                    nomeBloco,
                    notaMaximaBloco,
                    provaPraticaId
                }
            });
            return blocoProva;
        } catch (error) {
            console.error("Erro ao editar bloco de prova:", error);
            throw new Error("Erro ao editar bloco de prova. Verifique os dados fornecidos.");
        }
    }

    async consultarBlocoProva(idBloco: number) {
        try {
            const blocoProva = await this.prisma.blocoProva.findUnique({
                where: { idBloco },
                include: {
                    quesitos: {
                        include: {
                            subQuesitos: true,
                        }
                    }
                }
            });
            return blocoProva;
        } catch (error) {
            console.error("Erro ao consultar bloco de prova:", error);
            throw new Error("Erro ao consultar bloco de prova. Verifique os dados fornecidos.");
        }
    }


    async consultarBlocosProva() {
        try {
            const blocosProva = await this.prisma.blocoProva.findMany({
                orderBy: {
                    idBloco: 'asc'
                },
                include: {
                    ProvaPratica: {
                        include: {
                            categorias: true
                        }
                    },
                    quesitos: {
                        orderBy: {
                            idQuesito: 'asc'
                        },
                        include: {
                            subQuesitos: true
                        }
                    }
                }
            });
            return blocosProva;
        } catch (error) {
            console.error("Erro ao consultar blocos de prova:", error);
            throw new Error("Erro ao consultar blocos de prova. Verifique os dados fornecidos.");
        }
    }

}

const blocoProvaService = new BlocoProvaService(prisma);
export default blocoProvaService;