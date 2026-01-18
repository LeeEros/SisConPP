export interface RecursoFormData {
  idRecurso?: number;
  nomeRecurso: string;
  justificativa: string;
  arquivo?: File | null; 

  candidato: number;
  avaliador: number;
  quesitoRecurso: number;

  avaliacaoId: number;
  provaTeoricaIdprovaTeorica?: number | null;
  provaPraticaIdProvaPratica?: number | null;
}


export interface CandidatoResumo {
  idCandidato: number;
  nomeCompleto: string;
}

export interface UsuarioResumo {
  idUsuario: number;
  nomeCompleto: string;
}

export interface QuesitoResumo {
  idQuesito: number;
  nomeQuesito: string;
}

export type StatusRecurso = "PENDENTE" | "DEFERIDO" | "INDEFERIDO";

export interface Recurso {
  idRecurso: number;
  nomeRecurso: string;
  justificativa: string;
  dataRecurso: string;

  status: StatusRecurso;
  arquivos?: File[];

  avaliacaoId: number;
  candidato: number;
  avaliador: number;
  quesitoRecurso: number;

  provaTeoricaIdprovaTeorica?: number | null;
  provaPraticaIdProvaPratica?: number | null;

  Candidato?: CandidatoResumo | null;
  Usuario?: UsuarioResumo | null;
  Quesito?: QuesitoResumo | null;

  Avaliacao?: Record<string, unknown>;
  ProvaTeorica?: Record<string, unknown>;
  ProvaPratica?: Record<string, unknown>;
}

export interface RecursoStatusPayload {
  idRecurso: number;
  status: boolean; 
}

export type QuesitoAvaliavelDTO = {
  idQuesito: number;
  nomeQuesito: string;
  notaMaximaQuesito?: number | null;
  opcional?: boolean | null;

  notaQuesito?: number;
  comentario?: string;
};
