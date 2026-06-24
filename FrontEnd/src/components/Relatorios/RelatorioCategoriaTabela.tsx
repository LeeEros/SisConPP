import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getRelatorioPorCategoriaConcurso } from "../../services/api";
import { Trophy, FileText } from "lucide-react";

// --- INTERFACES LOCAIS PARA TIPAGEM ---
// Ajustadas conforme o JSON que você enviou no Postman
interface BlocoDTO {
  nomeBloco: string;
  notaFinalBloco: number;
}

interface AvaliadorDTO {
  nomeAvaliador: string;
  blocos: BlocoDTO[];
  totalAvaliador: number;
}

interface RelatorioItemDTO {
  candidatoId: number;
  nomeCandidato: string;
  CTG: string; // Campo confirmado
  categoria: string;
  concurso: string;
  notaProvaTeorica: number;
  notaProvasPraticas: number;
  notaFinal: number;
  posicao: number;
  avaliadores: AvaliadorDTO[];
}

// Interface para os dados processados na tabela
interface CandidatoConsolidado {
  id: number;
  posicao: number;
  nome: string;
  entidade: string;
  notaEscrita: number;
  provasPraticas: {
    nomeProva: string;
    notasAvaliadores: number[];
    totalProva: number;
  }[];
  notaFinal: number;
}

interface Props {
  categoriaId: number;
  concursoIdConcurso: number;
}

export default function RelatorioCategoriaConsolidado({ categoriaId, concursoIdConcurso }: Props) {
  const [dadosProcessados, setDadosProcessados] = useState<CandidatoConsolidado[]>([]);
  const [loading, setLoading] = useState(false);
  const [colunasDinamicas, setColunasDinamicas] = useState<string[]>([]);
  const [maxAvaliadores, setMaxAvaliadores] = useState(0);

  useEffect(() => {
    const fetchRelatorio = async () => {
      setLoading(true);
      try {
        // Chamada à API
        const data = await getRelatorioPorCategoriaConcurso(categoriaId, concursoIdConcurso);
        
        // Forçando a tipagem com base no JSON que você mostrou
        if (Array.isArray(data) && data.length > 0) {
          processarDados(data as unknown as RelatorioItemDTO[]);
        } else {
          setDadosProcessados([]);
        }
      } catch (error) {
        console.error("Erro ao buscar relatório:", error);
        toast.error("Erro ao carregar relatório detalhado");
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId && concursoIdConcurso) {
      fetchRelatorio();
    }
  }, [categoriaId, concursoIdConcurso]);

  const processarDados = (data: RelatorioItemDTO[]) => {
    const nomesProvas = new Set<string>();
    let maxAv = 0;

    const processados = data.map((cand) => {
      // Mapa para agrupar notas por tipo de prova (ex: "Prova Oral")
      const mapaProvas = new Map<string, { notas: number[], total: number }>();

      // Itera sobre avaliadores e seus blocos
      cand.avaliadores.forEach((av) => {
        av.blocos.forEach((bloco) => {
          if (!mapaProvas.has(bloco.nomeBloco)) {
            mapaProvas.set(bloco.nomeBloco, { notas: [], total: 0 });
            nomesProvas.add(bloco.nomeBloco);
          }
          const prova = mapaProvas.get(bloco.nomeBloco)!;
          prova.notas.push(bloco.notaFinalBloco);
          prova.total += bloco.notaFinalBloco;
        });
      });

      // Descobre o número máximo de avaliadores em uma única prova (para desenhar as colunas Av1, Av2...)
      mapaProvas.forEach((p) => {
        if (p.notas.length > maxAv) maxAv = p.notas.length;
      });

      return {
        id: cand.candidatoId,
        posicao: cand.posicao,
        nome: cand.nomeCandidato,
        entidade: cand.CTG, // AQUI: Lendo o campo CTG do seu JSON
        notaEscrita: cand.notaProvaTeorica,
        notaFinal: cand.notaFinal,
        provasPraticas: Array.from(mapaProvas.entries()).map(([nome, dados]) => ({
          nomeProva: nome,
          notasAvaliadores: dados.notas,
          totalProva: dados.total
        }))
      };
    });

    setColunasDinamicas(Array.from(nomesProvas));
    setMaxAvaliadores(maxAv > 0 ? maxAv : 1); // Garante pelo menos 1 coluna se não tiver avaliadores
    setDadosProcessados(processados);
  };

  // --- Renderização de Loading e Vazio ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3 animate-pulse">
        <FileText size={40} />
        <p className="text-lg font-medium">Processando dados...</p>
      </div>
    );
  }

  if (dadosProcessados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3 opacity-60">
        <FileText size={40} />
        <p className="text-lg font-medium">Nenhum dado para exibir.</p>
      </div>
    );
  }

  // --- Helper para o Badge de Posição ---
  const renderPosicaoBadge = (posicao: number) => {
    let styleClass = "bg-gray-100 text-gray-600 border-gray-200"; // Padrão
    
    if (posicao === 1) styleClass = "bg-yellow-100 text-yellow-700 border-yellow-300 shadow-sm";
    else if (posicao === 2) styleClass = "bg-gray-200 text-gray-700 border-gray-300 shadow-sm";
    else if (posicao === 3) styleClass = "bg-orange-100 text-orange-800 border-orange-300 shadow-sm";

    return (
      <div className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto font-bold text-xs border ${styleClass}`}>
        {posicao}º
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
      
      {/* Cabeçalho do Card */}
      <div className="bg-secondary-light p-4 border-b border-secondary/20 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold text-secondary-on flex items-center gap-2">
          <Trophy size={20} className="text-white" />
          Relatório Consolidado
        </h2>
      </div>

      {/* Tabela "Planilhão" */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <table className="w-full text-xs border-collapse border border-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            {/* Linha 1: Títulos das Grandes Colunas */}
            <tr>
              <th rowSpan={2} className="border border-gray-200 px-2 py-2 min-w-[50px] text-gray-700 font-bold bg-gray-100">#</th>
              <th rowSpan={2} className="border border-gray-200 px-3 py-2 text-left min-w-[200px] text-gray-800 font-bold bg-gray-100">Candidato</th>
              <th rowSpan={2} className="border border-gray-200 px-3 py-2 text-left min-w-[150px] text-gray-700 font-bold bg-gray-100">CTG / Entidade</th>
              
              <th rowSpan={2} className="border border-gray-200 px-2 py-2 w-[80px] text-blue-800 font-bold bg-blue-50">Teórica</th>

              {colunasDinamicas.map(prova => (
                <th 
                  key={prova} 
                  colSpan={maxAvaliadores + 1}
                  className="border border-gray-200 px-2 py-2 text-center font-bold uppercase text-gray-700 bg-gray-100"
                >
                  {prova}
                </th>
              ))}

              <th rowSpan={2} className="border border-gray-200 px-3 py-2 font-bold text-primary-dark w-[90px] bg-primary/5">Nota Final</th>
            </tr>

            {/* Linha 2: Sub-colunas (AV1, AV2... Total) */}
            <tr>
              {colunasDinamicas.map(prova => (
                <>
                  {Array.from({ length: maxAvaliadores }).map((_, i) => (
                    <th key={`${prova}-av${i}`} className="border border-gray-200 px-1 py-1 w-[45px] text-gray-500 font-medium bg-white text-[10px]">
                      Av{i + 1}
                    </th>
                  ))}
                  <th className="border border-gray-200 px-1 py-1 w-[55px] font-bold text-gray-700 bg-gray-50 text-[11px]">Total</th>
                </>
              ))}
            </tr>
          </thead>

          <tbody>
            {dadosProcessados.map((cand, idx) => (
              <tr key={cand.id} className={`transition-colors border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                
                {/* Posição */}
                <td className="border-r border-gray-200 px-2 py-3 text-center align-middle">
                   {renderPosicaoBadge(cand.posicao)}
                </td>

                {/* Nome */}
                <td className="border-r border-gray-200 px-3 py-3 font-bold text-gray-800 align-middle truncate max-w-[220px]" title={cand.nome}>
                  {cand.nome}
                </td>

                {/* CTG */}
                <td className="border-r border-gray-200 px-3 py-3 text-gray-600 align-middle truncate max-w-[180px]" title={cand.entidade}>
                  {cand.entidade}
                </td>
                
                {/* Nota Escrita */}
                <td className="border-r border-gray-200 px-2 py-3 text-center font-semibold text-blue-700 bg-blue-50/20 align-middle">
                  {cand.notaEscrita.toFixed(2)}
                </td>

                {/* Notas Dinâmicas (Blocos) */}
                {colunasDinamicas.map(nomeProva => {
                  const dadosProva = cand.provasPraticas.find(p => p.nomeProva === nomeProva);
                  const notas = dadosProva ? dadosProva.notasAvaliadores : [];
                  const total = dadosProva ? dadosProva.totalProva : 0;

                  return (
                    <>
                      {/* Notas Individuais */}
                      {Array.from({ length: maxAvaliadores }).map((_, i) => (
                        <td key={`${nomeProva}-nota-${i}`} className="border-r border-gray-200 px-1 py-3 text-center text-gray-500 text-[11px] align-middle">
                          {notas[i] !== undefined ? notas[i].toFixed(2) : '-'}
                        </td>
                      ))}
                      {/* Total da Prova */}
                      <td className="border-r border-gray-200 px-1 py-3 text-center font-semibold text-gray-700 bg-gray-50 align-middle">
                        {total > 0 ? total.toFixed(2) : '-'}
                      </td>
                    </>
                  );
                })}

                {/* Nota Final */}
                <td className="px-3 py-3 text-center font-bold text-xl text-primary bg-primary/10 align-middle">
                  {cand.notaFinal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estilos da barra de rolagem */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}