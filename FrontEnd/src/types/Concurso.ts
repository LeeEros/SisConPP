export interface Concurso{
    idConcurso: number,
    nomeConcurso: string,
    lancamentoEdital: Date,
    inscricoesInicio: Date,
    inscricoesFinal: Date,
    dataProvaEscrita: Date,
    dataProvasPraticas: Date,
    dataResultado: Date,
    local: string,
    anexoEdital?: Blob     
}