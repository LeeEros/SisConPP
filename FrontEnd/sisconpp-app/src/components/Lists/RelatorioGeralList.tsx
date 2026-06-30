import { useEffect, useMemo, useRef, useState } from "react";
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

    const categorias = useMemo(() => {
        const grupos: Record<string, RelatorioGeralCandidatoDTO[]> = {};

        dados.forEach((item) => {
            const categoria = item.categoria || "Sem categoria";

            if (!grupos[categoria]) {
                grupos[categoria] = [];
            }

            grupos[categoria].push(item);
        });

        return Object.entries(grupos).map(([categoria, candidatos]) => {
            const ordenados = [...candidatos].sort(
                (a, b) => (b.notaFinal ?? 0) - (a.notaFinal ?? 0)
            );

            let ultimaNota: number | null = null;
            let colocacao = 0;

            const ranking = ordenados.map((candidato, index) => {
                const nota = candidato.notaFinal ?? 0;

                if (ultimaNota === null || nota !== ultimaNota) {
                    colocacao = index + 1;
                    ultimaNota = nota;
                }

                return {
                    ...candidato,
                    colocacao,
                };
            });

            return {
                categoria,
                candidatos: ranking,
            };
        });
    }, [dados]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-onSurface opacity-60 gap-3 animate-pulse">
                <Loader2
                    size={32}
                    className="animate-spin text-primary"
                />
                <p className="text-sm font-medium">
                    Carregando Relatório Geral...
                </p>
            </div>
        );
    }

    if (dados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-onSurface opacity-50 gap-3 border-2 border-dashed border-outline-variant rounded-xl m-4">
                <AlertCircle size={32} />
                <p className="text-lg font-medium">
                    Nenhum resultado encontrado.
                </p>
            </div>
        );
    }

    return (
        <div
            ref={relatorioRef}
            className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden"
        >
            <div className="overflow-x-auto custom-scrollbar">

                {categorias.map(({ categoria, candidatos }) => (
                    <div key={categoria} className="mb-8">

                        <div className="bg-primary text-white px-5 py-3 font-bold text-lg">
                            Categoria: {categoria}
                        </div>

                        <table className="w-full text-sm text-left">

                            <thead className="bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">

                                <tr>

                                    <th className="p-4 text-center w-24">
                                        Colocação
                                    </th>

                                    <th className="p-4">
                                        Candidato
                                    </th>

                                    <th className="p-4 text-center">
                                        Teórica
                                    </th>

                                    <th className="p-4 text-center">
                                        Prática
                                    </th>

                                    <th className="p-4 text-center bg-primary-container/20 text-primary-dark">
                                        Final
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-outline-variant">

                                {candidatos.map((item) => {

                                    let medalha = `${item.colocacao}º`;

                                    if (item.colocacao === 1)
                                        medalha = "🥇 1º";

                                    else if (item.colocacao === 2)
                                        medalha = "🥈 2º";

                                    else if (item.colocacao === 3)
                                        medalha = "🥉 3º";

                                    return (

                                        <tr
                                            key={item.candidatoId}
                                            className="hover:bg-surface-container transition-colors"
                                        >

                                            <td className="p-4 text-center font-bold text-primary-dark">
                                                {medalha}
                                            </td>

                                            <td
                                                className="p-4 font-medium text-neutral-onSurface"
                                                title={item.nomeCandidato}
                                            >
                                                {item.nomeCandidato || "---"}
                                            </td>

                                            <td className="p-4 text-center">

                                                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                                                    {item.notaProvaTeorica?.toFixed(2) ??
                                                        "-"}
                                                </span>

                                            </td>

                                            <td className="p-4 text-center">

                                                <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                                                    {item.notaProvasPraticas?.toFixed(
                                                        2
                                                    ) ?? "-"}
                                                </span>

                                            </td>

                                            <td className="p-4 text-center bg-primary-container/5 font-bold text-primary-dark text-base">
                                                {item.notaFinal?.toFixed(2) ?? "-"}
                                            </td>

                                        </tr>

                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                ))}

            </div>
        </div>
    );
}