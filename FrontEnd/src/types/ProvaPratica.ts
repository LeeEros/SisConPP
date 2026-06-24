export interface ProvaPratica {
    idProvaPratica: number;
    nomeProva: string;
    notaMaxima: number;
    categorias: number[];
    blocosProvas: BlocoProva[];    
}

export interface SubQuesitos {
    idSubequestios?: number; 
    nomeSubquesito: string;
    notaSubequesito: number;
    quesitoId: number;
    subGrupo?: SubGrupoVivencia | null;
}

export enum SubGrupoVivencia {
    APRESENTACAO_PASTA = "APRESENTACAO_PASTA",
    APROVEITAMENTO_TEMPO = "APROVEITAMENTO_TEMPO",
    COLABORACAO_PROMOCOES = "COLABORACAO_PROMOCOES",
    PARTICIPACAO_EVENTOS = "PARTICIPACAO_EVENTOS"
}

export interface Quesitos {
    idQuesito?: number;
    nomeQuesito: string;
    notaMaximaQuesito: number;
    opcional: boolean;
    blocoProvaIdBloco?: number;
    subQuesitos?: SubQuesitos[]; 
    provaTeoricaIdprovaTeorica?: number;
}

export interface BlocoProva {
    idBloco?: number; 
    nomeBloco: string;
    notaMaximaBloco: number;
    provaPraticaId: number;
    quesitos?: Quesitos[]; 
}