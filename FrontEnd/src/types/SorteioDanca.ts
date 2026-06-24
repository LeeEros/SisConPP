export enum DancaSalaoTradicional {
  DANCA_DE_SALAO = 'DANCA_DE_SALAO',
  DANCA_TRADICIONAL = 'DANCA_TRADICIONAL',
}

export interface Danca{
  idDanca: number,
  nomeDanca: string,
  dancaSalaoTradicional: DancaSalaoTradicional,
  quesitosId: number[]
}
 

export interface PreferenciaSorteio {
  nomeSorteioDanca: DancaSalaoTradicional;
  candidatoId: number;
  dancas: number[];
}

export interface SorteioDanca {
  idSorteio: number;
  resultadoSorteio: number;
  dataSorteio: Date;
  tipoDanca: DancaSalaoTradicional;
  candidatoId: number;
  usuarioId: number;
  dancaSorteado?: Danca;
}

export interface CriarSorteioPayload{
  candidatoId: number;
  usuarioId: number;
  tipoDanca: DancaSalaoTradicional;
}