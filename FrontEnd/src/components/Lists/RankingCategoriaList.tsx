import { useEffect, useState, useRef } from "react";
import { RelatorioRankingDTO } from "../../types/Relatorios";
import { rankingPorCategoria } from "../../services/api";
import { toast } from "react-toastify";
import { Loader2, AlertCircle, Medal } from "lucide-react";

interface RankingCategoriaListProps {
    concursoId: number;
    categoriaId: number;
}

export default function RankingCategoriaList({ concursoId, categoriaId }: RankingCategoriaListProps) {
    const [ranking, setRanking] = useState<RelatorioRankingDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const rankingRef = useRef<HTMLDivElement>(null);

    const fetchRanking = async () => {
        try {
            setLoading(true);
            const response = await rankingPorCategoria(concursoId, categoriaId);
            setRanking(response as RelatorioRankingDTO[]);
        } catch (error) {
            console.error("Erro ao carregar relatorio:", error);
            toast.error("Erro ao carregar ranking da categoria");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (concursoId && categoriaId) {
            fetchRanking();
        }
    }, [concursoId, categoriaId]);

    // Função para renderizar ícone de medalha
    const renderMedal = (posicao: number) => {
        if (posicao === 1) return <Medal size={20} className="text-yellow-500 fill-yellow-500 drop-shadow-sm" />;
        if (posicao === 2) return <Medal size={20} className="text-slate-400 fill-slate-400 drop-shadow-sm" />;
        if (posicao === 3) return <Medal size={20} className="text-orange-400 fill-orange-400 drop-shadow-sm" />;
        return <span className="text-sm font-bold text-neutral-500 w-5 text-center">{posicao}º</span>;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-onSurface opacity-60 gap-3 animate-pulse">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm font-medium">Calculando Ranking...</p>
            </div>
        );
    }

    if (ranking.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-onSurface opacity-50 gap-3 border-2 border-dashed border-outline-variant rounded-xl m-4">
                <AlertCircle size={32} />
                <p className="text-lg font-medium">Nenhum dado encontrado para o ranking.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden" ref={rankingRef}>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
                        <tr>
                            <th className="p-4 font-semibold uppercase tracking-wider text-center w-20">Posição</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Candidato</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Categoria</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-center w-32 bg-primary-container/20 text-primary-dark">Nota Final</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-outline-variant">
                        {ranking.map((item) => (
                            <tr 
                                key={item.candidatoId} 
                                className={`
                                    transition-colors
                                    ${item.classificacao === 1 ? 'bg-yellow-50/50 hover:bg-yellow-100/50' : 'hover:bg-surface-container'}
                                `}
                            >
                                <td className="p-4 text-center">
                                    <div className="flex justify-center items-center">
                                        {renderMedal(item.classificacao)}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`block font-medium ${item.classificacao === 1 ? 'text-neutral-900 font-bold' : 'text-neutral-onSurface'}`}>
                                        {item.nomeCandidato || "---"}
                                    </span>
                                </td>
                                <td className="p-4 text-neutral-onSurface opacity-80">
                                    {item.categoria || "---"}
                                </td>
                                <td className="p-4 text-center font-bold text-lg text-primary-dark bg-primary-container/5">
                                    {item.notaFinal?.toFixed(2) ?? "---"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}