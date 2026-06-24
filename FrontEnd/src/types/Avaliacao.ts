export interface Avaliacao {
  idAvaliacao: number;
  dataAvaliacao: Date;
  notaFinal: number;
  avaliadorId: number;
  candidatoId: number;
  provaPraticaId?: number;
  provaTeoricaId?: number;
  blocoProvaId?: number;
  fichaCandidatoFicha: number;
  quesitosAvaliados: AvaliacaoQuesito[]
}

export interface AvaliacaoQuesito {
  idAvaliacaoQuesito: number;
  notaQuesito: number;
  comentario: string;
  subQuesitosAvaliados: AvaliacaoSubQuesito[];
  avaliacaoId: number;
  quesitoId: number;
}

export interface AvaliacaoSubQuesito {
  idAvaliacaoSubQuesito: number;
  notaSubQuesito: number;
  subQuesitoId: number;
  avaliacaoQuesitoId?: number;
}

export interface CriarAvaliacaoPayload {
  avaliadorId: number
  candidatoId: number
  provasSelecionadas: number[]

  subQuesitos: {
    subQuesitoId: number
    nota: number
  }[]
}

export interface CriarAvaliacaoTeoricaPayload{
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

export interface CriarAvaliacaoCompletaDTO {
  comissaoId: number;
  avaliadorId: number;
  candidatoId: number;
  blocoProvaId: number;
  quesitos: {
    quesitoId: number;
    comentario?: string;
    subQuesitos: {
      subQuesitoId: number;
      notaSubQuesito: number;
    }[];
  }[];
};

export interface ProvaAccordionDTO {
  idProvaPratica: number;
  nomeProva: string;
  notaMaxima: number;
  blocosProvas: BlocoProvaDTO[];
}

export interface ProvaTeoricaAccordionDTO {
  idprovaTeorica: number;
  nomeProva: string;
  notaMaxima: number;
  numQuestao: number;
  gabaritoOficial?: Buffer;
  quesitos: QuesitoDTO[];
}

export interface BlocoProvaDTO {
  idBloco: number;
  nomeBloco: string;
  notaMaximaBloco: number;
  quesitos: QuesitoDTO[];
}

export interface QuesitoDTO {
  idQuesito: number;
  nomeQuesito: string;
  notaMaximaQuesito: number;
  opcional: boolean;
  subQuesitos: SubQuesitoDTO[];

  metaDanca?: MetaDancaDTO;
}

export interface SubQuesitoDTO {
  idSubequestios: number;
  nomeSubquesito: string;
  notaSubequesito: number;
  subGrupo?: SubGrupoVivencia;
}

export enum SubGrupoVivencia {
  APRESENTACAO_PASTA = "APRESENTACAO_PASTA",
  APROVEITAMENTO_TEMPO = "APROVEITAMENTO_TEMPO",
  COLABORACAO_PROMOCOES = "COLABORACAO_PROMOCOES",
  PARTICIPACAO_EVENTOS = "PARTICIPACAO_EVENTOS",
}

export type TipoDancaMeta = "DANCA_DE_SALAO" | "DANCA_TRADICIONAL";

export interface MetaDancaDTO {
  tipo: TipoDancaMeta;
  possuiSorteio: boolean;
  sorteada: string | null;
  escolhidas: string[] | null;
  textoExibicao?: string;
}

export interface ContextoDancasDTO {
  possuiSorteio: boolean;
  salao: {
    sorteada: string | null;
    escolhidas: string[] | null;
  };
  tradicional: {
    sorteada: string | null;
    escolhidas: string[] | null;
  };
}