export interface ProvaTeorica {
    idprovaTeorica?: number;
    nomeProva: string;
    notaMaxima: number;
    gabaritoOficial?: Buffer;
    numQuestoes: number;
    quesitos: Quesitos[];
    categorias?: number[];
}

export interface ProvaTeoricaF {
    nomeProva: string;
    notaMaxima: number;
    categorias?: number[];
    numQuestao: number;
}

export interface Quesitos {
    idQuesito?: number;
    nomeQuesito: string;
    notaMaximaQuesito: number;
    opcional: boolean;
    provaTeoricaIdprovaTeorica?: number;
    subQuesitos?: SubQuesitos[];
}

export interface SubQuesitos {
    idSubequestios?: number;
    nomeSubquesito: string;
    notaSubequesito: number;
    quesitoId: number;
}

