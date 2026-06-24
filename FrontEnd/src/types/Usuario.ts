export enum Funcao {
    AVALIADOR = 'AVALIADOR',
    AUXILIAR = 'AUXILIAR',
    SECRETARIO = 'SECRETARIO',
}

export enum Credenciamento {
    CREDENCIADO = 'CREDENCIADO',
    NAO_CREDENCIADO = 'NAO_CREDENCIADO'
}

export interface Usuario {
    idUsuario: number;
    nomeCompleto: string;
    cidade: string;
    estado: string;
    CTGId: number;
    numCarteirinha: string;
    login: string;
    senha: string;
    funcao: Funcao;
    credenciamento: Credenciamento;
    numCredenciamento?: number;
    comissaoUsuarioId?: number;
}

export interface UsuarioAvaliador {
    idUsuario: number;
    nomeCompleto: string;
    comissaoUsuarioId?: number;
    ComissaoUsuario?: {
        comissaoId: number;
        Comissao?: {
            idComissao: number;
            nomeComissao: string;
            atribuicoes?: { 
                categoriaId: number;
                provaPraticaId?: number | null;
                blocoProvaId?: number | null;
            }[];
        };
    };
}