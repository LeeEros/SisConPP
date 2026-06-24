import { useEffect, useState, useRef } from "react";
import { relatorioGeral } from "../../services/api";
import { RelatorioGeralCandidatoDTO } from "../../types/Relatorios";
import { Loader2, AlertCircle } from "lucide-react";

interface Props {
    concursoId: number;
}

export default function RelatorioGeralList({ concursoId }: Props) {
    const [dados, setDados] = useState<RelatorioGeralCandidatoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const relatorioRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function carregar() {
            setLoading(true);
            try {
                const result = await relatorioGeral(concursoId);
                setDados(result);
            } catch (error) {
                console.error("Erro ao carregar relatório", error);
            } finally {
                setLoading(false);
            }
        }

        if (concursoId) {
            carregar();
        }
    }, [concursoId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-onSurface opacity-60 gap-3 animate-pulse">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm font-medium">Carregando Relatório Geral...</p>
            </div>
        );
    }

    if (dados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-onSurface opacity-50 gap-3 border-2 border-dashed border-outline-variant rounded-xl m-4">
                <AlertCircle size={32} />
                <p className="text-lg font-medium">Nenhum resultado encontrado.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden" ref={relatorioRef}>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
                        <tr>
                            <th className="p-4 font-semibold uppercase tracking-wider">Candidato</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Categoria</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-center w-24">Teórica</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-center w-24">Práticas</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-center w-28 bg-primary-container/20 text-primary-dark">Final</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-outline-variant">
                        {dados.map((item) => (
                            <tr key={item.candidatoId} className="hover:bg-surface-container transition-colors">
                                <td className="p-4 font-medium text-neutral-onSurface truncate max-w-[200px]" title={item.nomeCandidato}>
                                    {item.nomeCandidato || "---"}
                                </td>
                                <td className="p-4 text-neutral-onSurface opacity-80 truncate max-w-[150px]" title={item.categoria}>
                                    {item.categoria || "---"}
                                </td>
                                <td className="p-4 text-center">
                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                                        {item.notaProvaTeorica?.toFixed(2) ?? "-"}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 font-medium border border-purple-100">
                                        {item.notaProvasPraticas?.toFixed(2) ?? "-"}
                                    </span>
                                </td>
                                <td className="p-4 text-center bg-primary-container/5 font-bold text-primary-dark text-base">
                                    {item.notaFinal?.toFixed(2) ?? "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}