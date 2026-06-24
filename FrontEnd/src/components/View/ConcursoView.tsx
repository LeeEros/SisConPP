import { Calendar, MapPin, Trophy, Paperclip, FileText, CheckCircle2 } from "lucide-react";
import { Concurso } from "../../types/Concurso";

interface Props {
  concurso: Concurso;
}

export default function ConcursoView({ concurso }: Props) {
  
  const formatarData = (data: string | Date | undefined) => {
    if (!data) return "A definir";
    const dateObj = new Date(data);
    return dateObj.toLocaleDateString("pt-BR");
  };

  // Função simples para simular a abertura do arquivo (caso venha do backend como buffer ou url)
  const abrirEdital = () => {
    if (concurso.anexoEdital) {
        // Lógica de visualização (similar ao do Candidato)
        console.log("Abrindo edital...", concurso.anexoEdital);
        // Aqui você implementaria a conversão de Buffer/Blob igual ao VisualizacaoCandidato
    }
  };

  return (
    <div className="w-full max-w-5xl p-4">
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 border-b border-gray-300 pb-4 mb-6">
        <div className="bg-gray-100 p-3 rounded-full">
          <Trophy size={48} className="text-yellow-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 uppercase leading-tight">
            {concurso.nomeConcurso}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-600"/> Concurso Ativo
          </p>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Bloco: Localização */}
        <div>
          <p className="font-bold text-gray-900 text-xs uppercase mb-3 border-b border-gray-100 pb-1 text-green-700">
            Localização
          </p>
          <div className="grid grid-cols-1">
            <div className="flex items-start gap-3">
               <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <MapPin size={20} />
               </div>
               <div>
                  <p className="font-bold text-gray-900 text-sm uppercase">Local de Realização</p>
                  <p className="text-base text-gray-700 mt-1">{concurso.local}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bloco: Cronograma */}
        <div>
          <p className="font-bold text-gray-900 text-xs uppercase mb-3 border-b border-gray-100 pb-1 text-green-700">
            Cronograma Oficial
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-blue-700">
                    <Calendar size={18} />
                    <span className="font-bold text-xs uppercase">Publicação Edital</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{formatarData(concurso.lancamentoEdital)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-orange-700">
                    <Calendar size={18} />
                    <span className="font-bold text-xs uppercase">Inscrições</span>
                </div>
                <p className="text-sm text-gray-600">
                    De <strong className="text-gray-800">{formatarData(concurso.inscricoesInicio)}</strong> <br/>
                    até <strong className="text-gray-800">{formatarData(concurso.inscricoesFinal)}</strong>
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-purple-700">
                    <Calendar size={18} />
                    <span className="font-bold text-xs uppercase">Prova Escrita</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{formatarData(concurso.dataProvaEscrita)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-pink-700">
                    <Calendar size={18} />
                    <span className="font-bold text-xs uppercase">Provas Práticas</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{formatarData(concurso.dataProvasPraticas)}</p>
            </div>

          </div>
        </div>

        {/* Bloco: Documentação */}
        <div>
            <p className="font-bold text-gray-900 text-xs uppercase mb-3 border-b border-gray-100 pb-1 text-green-700">
                Documentos e Anexos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                    type="button"
                    onClick={abrirEdital}
                    className={`flex items-center text-left text-sm p-4 rounded-lg border transition-all group ${
                        concurso.anexoEdital
                        ? 'bg-white border-gray-200 hover:border-primary hover:shadow-md cursor-pointer'
                        : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                    }`}
                >
                    <div className={`p-2 rounded-lg mr-3 ${concurso.anexoEdital ? 'bg-red-50 text-red-600' : 'bg-gray-200 text-gray-400'}`}>
                        <FileText size={24} />
                    </div>
                    
                    <div className="flex-1">
                        <span className="block font-bold text-gray-800 group-hover:text-primary transition-colors">
                            Edital Oficial
                        </span>
                        <span className="text-xs text-gray-500">
                            {concurso.anexoEdital ? "Clique para visualizar PDF" : "Arquivo não anexado"}
                        </span>
                    </div>

                    {concurso.anexoEdital && <Paperclip size={16} className="text-gray-400 group-hover:text-primary" />}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}