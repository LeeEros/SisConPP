import { BlocoProva, Categoria, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ProvaPraticaService {

    async criarProvaPratica(
        nomeProva: string,
        notaMaxima: number,
        categorias: number[],
        blocodProva: number[]
    ) {
        try {
            const provaPratica = await prisma.provaPratica.create({
                data: {
                    nomeProva,
                    notaMaxima,
                    categorias: {
                        connect: categorias?.map((id: number) => ({
                            idCategoria: id,
                        })),
                    },
                    blocosProvas: {
                        connect: blocodProva?.map((id: number) => ({
                            idBloco: id,
                        })),
                    },
                }
            });
            return provaPratica;
        } catch (error) {
            console.error("Erro ao criar prova prática:", error);
            throw new Error("Erro ao criar prova prática. Verifique os dados fornecidos.");
        }
    }

    async buscarProvaPraticaPorId(idProvaPratica: number) {
        try {
            const provaPratica = await prisma.provaPratica.findUnique({
                where: { idProvaPratica }
            });
            return provaPratica;
        } catch (error) {
            console.error("Erro ao listar prova prática:", error);
            throw new Error("Erro ao listar prova prática.");
        }
    }

    async buscarProvasPraticas() {
        try {
            const provasPraticas = await prisma.provaPratica.findMany({
                include: {
                    categorias: true,
                    blocosProvas: {
                        include: {
                            quesitos: {
                                include: {
                                    subQuesitos: true
                                }
                            }
                        }
                    }
                }
            });
            return provasPraticas;
        } catch (error) {
            console.error("Erro ao listar provas práticas:", error);
            throw new Error("Erro ao listar provas práticas.");
        }
    }

    async buscarProvaPraticaPorCategoria(categoriaId: number) {
        const provaPraticaPorCategoria = await prisma.provaPratica.findMany({
            where: {
                categorias: {
                    some: {
                        idCategoria: categoriaId
                    }
                }
            },
            include: {
                blocosProvas: {
                    include: {
                        quesitos: {
                            include: {
                                subQuesitos: true
                            }
                        }
                    }
                }
            }
        });
        return provaPraticaPorCategoria
    }

    async atualizarProvaPratica(
        idProvaPratica: number,
        nomeProva?: string,
        notaMaxima?: number,
        categorias?: number[],
        blocodProva?: number[]
    ) {
        try {
            const provaPratica = await prisma.provaPratica.update({
                where: { idProvaPratica },
                data: {
                    nomeProva,
                    notaMaxima,
                    categorias: {
                        connect: categorias?.map((id: number) => ({
                            idCategoria: id,
                        })),
                    },
                    blocosProvas: {
                        connect: blocodProva?.map((id: number) => ({
                            idBloco: id,
                        })),
                    },
                },
            });

            return provaPratica;
        } catch (error) {
            console.error("Erro ao atualizar prova prática:", error);
            throw new Error("Erro ao atualizar prova prática. Verifique os dados fornecidos.");
        }
    }
}

const provaPraticaService = new ProvaPraticaService();
export default provaPraticaService;
