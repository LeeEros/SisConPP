import { useMemo } from "react";
import { Candidato } from "../../types/Candidato";
import { CTG } from "../../types/CTG";
import { Categoria } from "../../types/Categoria";
import { Paperclip, XCircle, Image as ImageIcon, Eye } from "lucide-react";

interface Props {
  candidato: Candidato;
  ctg?: CTG;
  categoria?: Categoria;
}

interface BufferResponse {
  type: string;
  data: number[];
}

type CandidatoExpandido = Candidato & {
  CTG?: CTG;
  ctg?: CTG;
  Categoria?: Categoria;
  categoria?: Categoria;
};

export default function VisualizacaoCandidato({ candidato}: Props) {
  const dadosCandidato = candidato as CandidatoExpandido;

  const dadosCTG = dadosCandidato.CTG || dadosCandidato.ctg;
  const dadosCategoria = dadosCandidato.Categoria || dadosCandidato.categoria;


  const visualizarArquivo = (fileData: unknown) => {
    if (!fileData) return;

    try {
      const buffer = fileData as BufferResponse;

      if (buffer && buffer.data) {
        const byteArray = new Uint8Array(buffer.data);
        
        let mimeType = 'application/pdf'; 
        
        if (byteArray[0] === 0xFF && byteArray[1] === 0xD8) mimeType = 'image/jpeg';
        if (byteArray[0] === 0x89 && byteArray[1] === 0x50) mimeType = 'image/png';

        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error("Erro ao abrir arquivo:", e);
      alert("Não foi possível visualizar este arquivo.");
    }
  };

  const listaDocumentos = [
    { label: "Cópia Documento (RG/CPF)", fileData: candidato.anexoDocumento },
    { label: "Carteira Tradicionalista", fileData: candidato.anexoCarteirinha },
    { label: "Comprovante Escolaridade", fileData: candidato.anexoEscolaridade },
    { label: "Comprovante de Residência", fileData: candidato.anexoResidencia },
    { label: "Ata do Concurso Interno", fileData: candidato.anexoAtaConcurso },
    { label: "Ficha de Inscrição", fileData: candidato.fichaInscricao },
    { label: "Termo de Compromisso", fileData: candidato.anexoTermoCandidato },
    { label: "Relatório de Vivência", fileData: candidato.anexoRelatorioVivencia },
    { label: "Autorização dos Pais/Resp.", fileData: candidato.anexoResponsavel },
    { label: "Prova Esportiva/Campeira", fileData: candidato.anexoProvaEsportivaCampeira },
  ];

  const fotoUrl = useMemo(() => {
    if (!candidato.anexoFoto) return null;
    try {
      const buffer = candidato.anexoFoto as unknown as BufferResponse;
      if (buffer && buffer.data && Array.isArray(buffer.data)) {
        const base64String = btoa(
          new Uint8Array(buffer.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        return `data:image/jpeg;base64,${base64String}`;
      }
      if (typeof candidato.anexoFoto === 'string') {
        return candidato.anexoFoto;
      }
      return null;
    } catch (e) {
      console.error("Erro ao converter imagem", e);
      return null;
    }
  }, [candidato.anexoFoto]);

  return (
    <div className="w-full max-w-5xl p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-1/3 flex flex-col">
          <div 
            className="aspect-[3/4] w-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition-opacity relative group"
            onClick={() => visualizarArquivo(candidato.anexoFoto)}
            title="Clique para ampliar a foto"
          >
            {fotoUrl ? (
              <>
                <img
                  src={fotoUrl}
                  alt="Foto do Candidato"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <Eye className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={32} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon size={64} />
                <span className="text-sm mt-2 font-medium">Sem anexoFoto</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4 text-sm text-gray-800">
          <div className="border-b border-gray-300 pb-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">{candidato.nomeCompleto}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-bold text-gray-900 text-xs uppercase mb-1">CPF</p>
              <p className="text-base text-gray-700">{candidato.CPF}</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs uppercase mb-1">RG</p>
              <p className="text-base text-gray-700">{candidato.RG}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-bold text-gray-900 text-xs uppercase mb-1">Categoria</p>
              <p className="text-base text-gray-700">{dadosCategoria?.nomeCategoria}</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs uppercase mb-1">Escolaridade</p>
              <p className="text-base text-gray-700">{candidato.escolaridade}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-bold text-gray-900 text-xs uppercase mb-1">CTG</p>
              <p className="text-base text-gray-700">{dadosCTG?.nomeCTG}</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs uppercase mb-1">RT</p>
              <p className="text-base text-gray-700">{dadosCTG?.RTid}º RT</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-bold text-gray-900 text-xs uppercase mb-3 border-b border-gray-200 pb-1">
              Filiação
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Pai</p>
                <p className="text-base text-gray-700">{candidato.filiacaoPai || "Não informado"}</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs uppercase mb-1">Mãe</p>
                <p className="text-base text-gray-700">{candidato.filiacaoMae || "Não informada"}</p>
              </div>
            </div>
          </div>

          {candidato.ProvaCampeiraEsportiva && (
            <div className="mt-2">
              <p className="font-bold text-gray-900 text-xs uppercase mb-1">Prova Campeira/Esportiva</p>
              <p className="text-base text-gray-700">{candidato.ProvaCampeiraEsportiva}</p>
            </div>
          )}

          <div className="mt-2">
            <p className="font-bold text-gray-900 text-xs uppercase mb-1">Endereço</p>
            <p className="text-base text-gray-700">Rua {candidato.endereco}, {candidato.numEndereco}, {candidato.bairro}</p>
            <p className="text-base text-gray-700">{candidato.cidade} - {candidato.estado}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Documentação Anexada (Clique para visualizar)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {listaDocumentos.map((doc, i) => {
            const existe = !!doc.fileData;
            return (
              <button
                key={i}
                type="button"
                disabled={!existe}
                onClick={() => existe && visualizarArquivo(doc.fileData)}
                className={`flex items-center text-left text-sm p-3 rounded-lg border transition-all ${
                  existe
                    ? 'text-green-800 bg-green-50 border-green-200 hover:bg-green-100 hover:shadow-md cursor-pointer'
                    : 'text-gray-400 border-gray-100 bg-gray-50 cursor-not-allowed opacity-70'
                }`}
                title={existe ? "Clique para abrir o documento" : "Documento não anexado"}
              >
                {existe ? (
                  <Paperclip className="mr-3 flex-shrink-0 text-green-600" size={18} />
                ) : (
                  <XCircle className="mr-3 flex-shrink-0 text-gray-300" size={18} />
                )}
                <span className="truncate font-medium flex-1">{doc.label}</span>
                
                {existe && <Eye className="ml-2 text-green-600 opacity-60" size={16} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}