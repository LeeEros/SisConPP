import { PrismaClient, ProvaCampeiraEsportiva } from "@prisma/client";

const prisma = new PrismaClient();

class CandidatoService {
    constructor(private prisma: PrismaClient) { }

    async criarCandidato(
        nomeCompleto: string,
        cidade: string,
        estado: string,
        CTGId: number,
        numCarteirinha: string,
        categoriaId: number,
        CPF: string,
        RG: string,
        endereco: string,
        numEndereco: number,
        bairro: string,
        escolaridade: string,
        filiacaoPai: string,
        filiacaoMae: string,
        ProvaCampeiraEsportiva: ProvaCampeiraEsportiva,
        anexoFoto?: Buffer,
        anexoDocumento?: Buffer,
        anexoCarteirinha?: Buffer,
        anexoEscolaridade?: Buffer,
        anexoResidencia?: Buffer,
        anexoAtaConcurso?: Buffer,
        fichaInscricao?: Buffer,
        anexoTermoCandidato?: Buffer,
        anexoRelatorioVivencia?: Buffer,
        anexoResponsavel?: Buffer,
        anexoProvaEsportivaCampeira?: Buffer
    ) {
        try {
            const candidato = await this.prisma.candidato.create({
                data: {
                    nomeCompleto,
                    cidade,
                    estado,
                    CTGId,
                    numCarteirinha,
                    CPF,
                    RG,
                    endereco,
                    numEndereco,
                    bairro,
                    escolaridade,
                    filiacaoPai,
                    filiacaoMae,
                    ProvaCampeiraEsportiva,
                    anexoFoto: anexoFoto ? new Uint8Array(anexoFoto) : undefined,
                    anexoDocumento: anexoDocumento ? new Uint8Array(anexoDocumento) : undefined,
                    anexoCarteirinha: anexoCarteirinha ? new Uint8Array(anexoCarteirinha) : undefined,
                    anexoEscolaridade: anexoEscolaridade ? new Uint8Array(anexoEscolaridade) : undefined,
                    anexoResidencia: anexoResidencia ? new Uint8Array(anexoResidencia) : undefined,
                    anexoAtaConcurso: anexoAtaConcurso ? new Uint8Array(anexoAtaConcurso) : undefined,
                    fichaInscricao: fichaInscricao ? new Uint8Array(fichaInscricao) : undefined,
                    anexoTermoCandidato: anexoTermoCandidato ? new Uint8Array(anexoTermoCandidato) : undefined,
                    anexoRelatorioVivencia: anexoRelatorioVivencia ? new Uint8Array(anexoRelatorioVivencia) : undefined,
                    anexoResponsavel: anexoResponsavel ? new Uint8Array(anexoResponsavel) : undefined,
                    anexoProvaEsportivaCampeira: anexoProvaEsportivaCampeira ? new Uint8Array(anexoProvaEsportivaCampeira) : undefined,
                    categoriaId
                }
            });

            return { candidato };
        } catch (error) {
            console.error("Erro detalhado:", error);
            throw new Error("Erro ao criar candidato. Verifique os dados fornecidos.");
        }
    }

    async atualizarCandidato(
        idCandidato: number,
        data: {
            nomeCompleto?: string;
            cidade?: string;
            estado?: string;
            CTGId?: number;
            numCarteirinha?: string
            categoriaId?: number,
            CPF?: string,
            RG?: string,
            endereco?: string,
            numEndereco?: number,
            bairro?: string,
            escolaridade?: string,
            filiacaoPai?: string,
            filiacaoMae?: string,
            ProvaCampeiraEsportiva?: ProvaCampeiraEsportiva,
            anexoFoto?: Buffer,
            anexoDocumento?: Buffer,
            anexoCarteirinha?: Buffer,
            anexoEscolaridade?: Buffer,
            anexoResidencia?: Buffer,
            anexoAtaConcurso?: Buffer,
            fichaInscricao?: Buffer,
            anexoTermoCandidato?: Buffer,
            anexoRelatorioVivencia?: Buffer,
            anexoResponsavel?: Buffer,
            anexoProvaEsportivaCampeira?: Buffer
        },
    ) {
        try {
            const candidatoExistente = await this.prisma.candidato.findUnique({
                where: { idCandidato }
            });

            if (!candidatoExistente) {
                throw new Error("Candidato não encontrado");
            }

            const candidatoAtualizado = await this.prisma.candidato.update({
                where: { idCandidato },
                data: {
                    ...data,
                    anexoFoto: data.anexoFoto ? new Uint8Array(data.anexoFoto) : candidatoExistente.anexoFoto,
                    anexoDocumento: data.anexoDocumento ? new Uint8Array(data.anexoDocumento) : candidatoExistente.anexoDocumento,
                    anexoCarteirinha: data.anexoCarteirinha ? new Uint8Array(data.anexoCarteirinha) : candidatoExistente.anexoCarteirinha,
                    anexoEscolaridade: data.anexoEscolaridade ? new Uint8Array(data.anexoEscolaridade) : candidatoExistente.anexoEscolaridade,
                    anexoResidencia: data.anexoResidencia ? new Uint8Array(data.anexoResidencia) : candidatoExistente.anexoResidencia,
                    anexoAtaConcurso: data.anexoAtaConcurso ? new Uint8Array(data.anexoAtaConcurso) : candidatoExistente.anexoAtaConcurso,
                    fichaInscricao: data.fichaInscricao ? new Uint8Array(data.fichaInscricao) : candidatoExistente.fichaInscricao,
                    anexoTermoCandidato: data.anexoTermoCandidato ? new Uint8Array(data.anexoTermoCandidato) : candidatoExistente.anexoTermoCandidato,
                    anexoRelatorioVivencia: data.anexoRelatorioVivencia ? new Uint8Array(data.anexoRelatorioVivencia) : candidatoExistente.anexoRelatorioVivencia,
                    anexoResponsavel: data.anexoResponsavel ? new Uint8Array(data.anexoResponsavel) : candidatoExistente.anexoResponsavel,
                    anexoProvaEsportivaCampeira: data.anexoProvaEsportivaCampeira ? new Uint8Array(data.anexoProvaEsportivaCampeira) : candidatoExistente.anexoProvaEsportivaCampeira,
                }
            });

            return candidatoAtualizado;
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao atualizar candidato. Verifique os dados fornecidos.");
        }
    }

    async buscarCandidatoPorId(idCandidato: number) {
        try {
            const candidato = await this.prisma.candidato.findUnique({
                where: { idCandidato: idCandidato },
                include: {
                    Categoria: true,
                    CTG: true
                }
            });
            return candidato;
        } catch (error) {
            throw new Error("Erro ao buscar candidato.");
        }
    }

    async buscarCandidatos() {
        try {
            const candidatos = await this.prisma.candidato.findMany();
            return candidatos;
        } catch (error) {
            throw new Error("Erro ao buscar candidatos.");
        }
    }

    async buscarCandidatosPorAvaliador(avaliadorId: number) {
        try {
            const comissoes = await this.prisma.comissaoUsuario.findMany({
                where: { usuarioId: avaliadorId },
                include: { Comissao: { include: { atribuicoes: true } } }
            });

            // Cria as condições baseadas nos concursos das comissões e nas categorias que elas podem avaliar
            const whereOr = comissoes.flatMap(cu => {
                const concursoId = cu.Comissao?.concursoId;
                if (!concursoId) return [];

                const atribuicoes = cu.Comissao?.atribuicoes || [];

                // Se a comissão não tem atribuições definidas, não libera acesso a ninguém
                if (atribuicoes.length === 0) return [];

                // Se a comissão tem uma atribuição genérica (categoria null), avalia o concurso todo
                const avaliaTodasCategorias = atribuicoes.some(a => a.categoriaId === null);

                if (avaliaTodasCategorias) {
                    return [{ concursoIdConcurso: concursoId }];
                }

                const categoriasDaComissao = atribuicoes.map(a => a.categoriaId).filter(id => id !== null) as number[];

                return [{
                    concursoIdConcurso: concursoId,
                    categoriaId: { in: categoriasDaComissao }
                }];
            });

            if (whereOr.length === 0) return [];

            const candidatos = await this.prisma.candidato.findMany({
                where: {
                    OR: whereOr
                },
                include: {
                    Categoria: true,
                    CTG: true
                }
            });

            return candidatos;
        } catch (error) {
            throw new Error("Erro ao buscar candidatos vinculados ao avaliador.");
        }
    }

    async deletarCandidato(idCandidato: number) {
        try {
            console.log("IdCandidato:", idCandidato);

            const candidato = await this.prisma.candidato.findUnique({
                where: { idCandidato },
            });

            if (!candidato) {
                throw new Error("Candidato não encontrado.");
            }

            await this.prisma.candidato.delete({
                where: { idCandidato },
            });

            return { mensagem: "Candidato deletado com sucesso." };
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao deletar candidato.");
        }
    }

    async anexarAnexos(idCandidato: number, anexos: Partial<{
        anexoFoto: Buffer,
        anexoDocumento: Buffer,
        anexoCarteirinha: Buffer,
        anexoEscolaridade: Buffer,
        anexoResidencia: Buffer,
        anexoAtaConcurso: Buffer,
        fichaInscricao: Buffer,
        anexoTermoCandidato: Buffer,
        anexoRelatorioVivencia: Buffer,
        anexoResponsavel: Buffer,
        anexoProvaEsportivaCampeira: Buffer
    }>) {
        try {
            const candidato = await this.prisma.candidato.update({
                where: { idCandidato: idCandidato },
                data: {
                    anexoFoto: anexos.anexoFoto ? new Uint8Array(anexos.anexoFoto) : undefined,
                    anexoDocumento: anexos.anexoDocumento ? new Uint8Array(anexos.anexoDocumento) : undefined,
                    anexoCarteirinha: anexos.anexoCarteirinha ? new Uint8Array(anexos.anexoCarteirinha) : undefined,
                    anexoEscolaridade: anexos.anexoEscolaridade ? new Uint8Array(anexos.anexoEscolaridade) : undefined,
                    anexoResidencia: anexos.anexoResidencia ? new Uint8Array(anexos.anexoResidencia) : undefined,
                    anexoAtaConcurso: anexos.anexoAtaConcurso ? new Uint8Array(anexos.anexoAtaConcurso) : undefined,
                    fichaInscricao: anexos.fichaInscricao ? new Uint8Array(anexos.fichaInscricao) : undefined,
                    anexoTermoCandidato: anexos.anexoTermoCandidato ? new Uint8Array(anexos.anexoTermoCandidato) : undefined,
                    anexoRelatorioVivencia: anexos.anexoRelatorioVivencia ? new Uint8Array(anexos.anexoRelatorioVivencia) : undefined,
                    anexoResponsavel: anexos.anexoResponsavel ? new Uint8Array(anexos.anexoResponsavel) : undefined,
                    anexoProvaEsportivaCampeira: anexos.anexoProvaEsportivaCampeira ? new Uint8Array(anexos.anexoProvaEsportivaCampeira) : undefined
                }
            });
            return candidato;
        } catch (error) {
            throw new Error("Erro ao anexar anexos.");
        }
    }


    async visualizarAnexos(idCandidato: number) {
        try {
            const candidato = await this.prisma.candidato.findUnique({
                where: { idCandidato: idCandidato }
            });
            if (candidato) {
                return {
                    anexoFoto: candidato.anexoFoto,
                    anexoDocumento: candidato.anexoDocumento,
                    anexoCarteirinha: candidato.anexoCarteirinha,
                    anexoEscolaridade: candidato.anexoEscolaridade,
                    anexoResidencia: candidato.anexoResidencia,
                    anexoAtaConcurso: candidato.anexoAtaConcurso,
                    fichaInscricao: candidato.fichaInscricao,
                    anexoTermoCandidato: candidato.anexoTermoCandidato,
                    anexoRelatorioVivencia: candidato.anexoRelatorioVivencia,
                    anexoResponsavel: candidato.anexoResponsavel,
                    anexoProvaEsportivaCampeira: candidato.anexoProvaEsportivaCampeira
                };
            } else {
                throw new Error("Candidato não encontrado.");
            }
        } catch (error) {
            throw new Error("Erro ao visualizar anexos.");
        }
    }

    async editarAnexos(idCandidato: number, anexos: Partial<{
        anexoFoto: Buffer,
        anexoDocumento: Buffer,
        anexoCarteirinha: Buffer,
        anexoEscolaridade: Buffer,
        anexoResidencia: Buffer,
        anexoAtaConcurso: Buffer,
        fichaInscricao: Buffer,
        anexoTermoCandidato: Buffer,
        anexoRelatorioVivencia: Buffer,
        anexoResponsavel: Buffer,
        anexoProvaEsportivaCampeira: Buffer
    }>) {
        try {
            const candidato = await this.prisma.candidato.update({
                where: { idCandidato: idCandidato },
                data: {
                    anexoFoto: anexos.anexoFoto ? new Uint8Array(anexos.anexoFoto) : undefined,
                    anexoDocumento: anexos.anexoDocumento ? new Uint8Array(anexos.anexoDocumento) : undefined,
                    anexoCarteirinha: anexos.anexoCarteirinha ? new Uint8Array(anexos.anexoCarteirinha) : undefined,
                    anexoEscolaridade: anexos.anexoEscolaridade ? new Uint8Array(anexos.anexoEscolaridade) : undefined,
                    anexoResidencia: anexos.anexoResidencia ? new Uint8Array(anexos.anexoResidencia) : undefined,
                    anexoAtaConcurso: anexos.anexoAtaConcurso ? new Uint8Array(anexos.anexoAtaConcurso) : undefined,
                    fichaInscricao: anexos.fichaInscricao ? new Uint8Array(anexos.fichaInscricao) : undefined,
                    anexoTermoCandidato: anexos.anexoTermoCandidato ? new Uint8Array(anexos.anexoTermoCandidato) : undefined,
                    anexoRelatorioVivencia: anexos.anexoRelatorioVivencia ? new Uint8Array(anexos.anexoRelatorioVivencia) : undefined,
                    anexoResponsavel: anexos.anexoResponsavel ? new Uint8Array(anexos.anexoResponsavel) : undefined,
                    anexoProvaEsportivaCampeira: anexos.anexoProvaEsportivaCampeira ? new Uint8Array(anexos.anexoProvaEsportivaCampeira) : undefined
                }
            });
            return candidato;
        } catch (error) {
            throw new Error("Erro ao editar anexos.");
        }
    }

    async criarFichaCandidato(
        candidatoId: number,
        concursoId: number,
    ) {
        try {
            const fichaCandidato = await this.prisma.fichaCandidato.create({
                data: {
                    candidatoId,
                    concursoId,
                    notaCandidato: 0,
                    notaFinalProvaTeorica: 0,
                    notaFinalProvasPraticas: 0,
                    anexoTermodeCiencia: Buffer.from(""),
                    anexoGabarito: Buffer.from(""),
                    anexoRedacao: Buffer.from(""),
                    anexoProvaPratica: Buffer.from("")
                },
            });

            await this.prisma.candidato.update({
                where:{ idCandidato: candidatoId},
                data:{
                    concursoIdConcurso: concursoId
                }

            })
            return fichaCandidato;
        } catch (error) {
            console.error("Erro ao criar ficha do candidato:", error);
            throw new Error("Erro ao criar ficha do candidato");
        }
    }

    async buscarIdFicha(candidatoId: number,) {
        try {
            const fichaCandidatoId = await this.prisma.fichaCandidato.findUnique({
                where: { candidatoId: candidatoId }
            });

            if (!fichaCandidatoId) {
                throw new Error("Ficha do candidato não encontrada.");
            };

            return fichaCandidatoId;
        } catch (error) {
            throw new Error("Erro ao buscar Id da Ficha do Candidato.");
        }
    }


}

const candidatoService = new CandidatoService(prisma);
export default candidatoService;