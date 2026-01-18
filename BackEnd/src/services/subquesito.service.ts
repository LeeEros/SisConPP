import { PrismaClient, VivenciaSubGrupo } from "@prisma/client";

const prisma = new PrismaClient();

type CriarSubQuesitoDTO = {
  nomeSubquesito: string;
  notaSubequesito: number;
  quesitoId: number;
  subGrupo?: VivenciaSubGrupo | null;
};

type AtualizarSubQuesitoDTO = {
  nomeSubquesito?: string;
  notaSubequesito?: number;
  quesitoId?: number;
  subGrupo?: VivenciaSubGrupo | null;
};

class SubQuesitosService {
  constructor(protected prisma: PrismaClient) {}

  async criarsubQuesitos(data: CriarSubQuesitoDTO) {
    try {
      const subquesito = await this.prisma.subQuesitos.create({
        data: {
          nomeSubquesito: data.nomeSubquesito,
          notaSubequesito: data.notaSubequesito,
          quesitoId: data.quesitoId,
          subGrupo: data.subGrupo ?? null,
        },
      });

      return subquesito;
    } catch (error) {
      console.error("Erro detalhado:", error);
      throw new Error("Erro ao criar Subquesito. Verifique os dados fornecidos.");
    }
  }

  async atualizarsubQuesitos(idSubequestios: number, data: AtualizarSubQuesitoDTO) {
    try {
      const subquesito = await this.prisma.subQuesitos.update({
        where: { idSubequestios },
        data: {
          ...data,
          ...(data.subGrupo !== undefined ? { subGrupo: data.subGrupo } : {}),
        },
      });

      return subquesito;
    } catch (error) {
      console.error("Erro detalhado:", error);
      throw new Error("Erro ao atualizar Subquesito. Verifique os dados fornecidos.");
    }
  }

  async buscarSubQuesitoPorId(idSubequestios: number) {
    return await this.prisma.subQuesitos.findUnique({
      where: { idSubequestios },
      select: {
        idSubequestios: true,
        nomeSubquesito: true,
        notaSubequesito: true,
        quesitoId: true,
        subGrupo: true,
      },
    });
  }

  async buscarSubQuesitos() {
    return await this.prisma.subQuesitos.findMany({
      orderBy: { idSubequestios: "asc" },
      select: {
        idSubequestios: true,
        nomeSubquesito: true,
        notaSubequesito: true,
        quesitoId: true,
        subGrupo: true,
      },
    });
  }

  async deletarSubQuesito(idSubequestios: number) {
    try {
      await this.prisma.subQuesitos.delete({
        where: { idSubequestios },
      });

      return { message: "Subquesito deletado com sucesso." };
    } catch (error) {
      console.error("Erro detalhado:", error);
      throw new Error("Erro ao deletar Subquesito.");
    }
  }
}

const subQuesitosService = new SubQuesitosService(prisma);
export default subQuesitosService;