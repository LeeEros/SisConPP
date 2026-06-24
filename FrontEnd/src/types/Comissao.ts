import { Usuario } from "./Usuario";

export interface ComissaoUsuario {
    idComissaoUsuario: number;
    comissaoId: number;
    usuarioId: number;
    Usuarios: Usuario;
}

export interface Comissao {
    idComissao: number;
    nomeComissao: string;
    concursoId: number;

    concurso: {
        idConcurso: number;
        nomeConcurso: string;
        lancamentoEdital: string;
        inscricoesInicio: string;
        inscricoesFinal: string;
        dataProvaEscrita: string;
        dataProvasPraticas: string;
        dataResultado: string;
        local: string;
        anexoEdital: string | null;
    };

    usuarios: ComissaoUsuario[];
    atribuicoes: ComissaoProvaPratica[];
}

export interface ComissaoProvaPratica {
  idComissaoProvaPratica: number;

  categoriaId?: number;
  provaPraticaId?: number;
  blocoProvaId?: number;

  Categoria?: {
    idCategoria: number;
    nomeCategoria: string;
  };

  ProvaPratica?: {
    idProvaPratica: number;
    nomeProva: string;
  };

  BlocoProva?: {
    idBloco: number;
    nomeBloco: string;
  };
}

export interface ComissaoProvaPraticaForm {
    comissaoId: number;
    categoriaId?: number;
    provaPraticaId?: number;
    blocoProvaId?: number;
}