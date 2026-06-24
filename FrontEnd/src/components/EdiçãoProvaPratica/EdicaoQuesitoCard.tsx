import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Music, MessageSquare } from "lucide-react";
import { QuesitoDTO, SubGrupoVivencia } from "../../types/Avaliacao";
import EdicaoSubQuesitoInput from "./EdicaoSubQuesitoInput"; // <-- Importa o input de edição

interface Props {
    quesito: QuesitoDTO;
    notas: Record<number, number>;
    comentarios?: Record<number, string>;
    onChangeNota: (subQuesitoId: number, nota: number) => void;
    onChangeComentario?: (quesitoId: number, comentario: string) => void;
}

const LABEL_SUBGRUPO: Record<SubGrupoVivencia, string> = {
    [SubGrupoVivencia.APRESENTACAO_PASTA]: "Apresentação da pasta de vivência",
    [SubGrupoVivencia.APROVEITAMENTO_TEMPO]: "Aproveitamento do tempo no movimento tradicionalista",
    [SubGrupoVivencia.COLABORACAO_PROMOCOES]: "Colaboração na organização de promoções tradicionalistas",
    [SubGrupoVivencia.PARTICIPACAO_EVENTOS]: "Participação ou frequência em eventos tradicionalistas",
};

function isVivenciaQuesito(nome?: string) {
    return (nome ?? "").toLowerCase().includes("vivência tradicionalista");
}

export default function EdicaoQuesitoCard({
    quesito,
    notas,
    comentarios,
    onChangeNota,
    onChangeComentario,
}: Props) {
    const [open, setOpen] = useState(true);

    const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        onChangeComentario?.(quesito.idQuesito, value);
    };

    const isVivencia = isVivenciaQuesito(quesito?.nomeQuesito);

    const grupos = useMemo(() => {
        // Proteção extra: se subQuesitos não existir, retorna objeto vazio
        if (!quesito?.subQuesitos) return {} as Record<string, any>;

        return quesito.subQuesitos.reduce((map, sub) => {
            const key = (sub.subGrupo ?? "SEM_SUBGRUPO") as SubGrupoVivencia | "SEM_SUBGRUPO";
            (map[key] ??= []).push(sub);
            return map;
        }, {} as Record<SubGrupoVivencia | "SEM_SUBGRUPO", typeof quesito.subQuesitos>);
    }, [quesito?.subQuesitos]);

    const ordem: (SubGrupoVivencia | "SEM_SUBGRUPO")[] = [
        SubGrupoVivencia.APRESENTACAO_PASTA,
        SubGrupoVivencia.APROVEITAMENTO_TEMPO,
        SubGrupoVivencia.COLABORACAO_PROMOCOES,
        SubGrupoVivencia.PARTICIPACAO_EVENTOS,
        "SEM_SUBGRUPO",
    ];

    const metaDanca = (quesito as unknown as Record<string, unknown>)?.metaDanca as
        | {
            tipo: "DANCA_DE_SALAO" | "DANCA_TRADICIONAL";
            possuiSorteio: boolean;
            sorteada: string | null;
            escolhidas: string[] | null;
            textoExibicao: string | null;
        }
        | undefined;

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-800 text-lg">{quesito?.nomeQuesito || "Quesito"}</span>

                    <span className="text-xs text-gray-500 font-medium mt-1">
                        Nota Máxima: {quesito?.notaMaximaQuesito || 0} pts
                    </span>

                    {metaDanca?.textoExibicao && (
                        <div className="flex items-center gap-2 mt-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md w-fit border border-blue-100">
                            <Music size={16} className="text-blue-600" />
                            <span className="text-sm font-medium">
                                {metaDanca.textoExibicao}
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className={`p-2 rounded-lg transition-all ${
                        open
                            ? "bg-gray-800 text-white shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                    {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
            </div>

            <div className={`px-4 pb-4 space-y-4 bg-gray-50 border-t border-gray-100 pt-4 ${open ? "block" : "hidden"}`}>
                    {(!quesito?.subQuesitos || quesito.subQuesitos.length === 0) && (
                        <p className="text-sm text-gray-400 italic text-center py-2">Nenhum subquesito para avaliar.</p>
                    )}

                    {!isVivencia &&
                        quesito?.subQuesitos?.map((sub) => (
                            <EdicaoSubQuesitoInput
                                key={sub.idSubequestios}
                                subQuesito={sub}
                                value={notas[sub.idSubequestios] ?? ""}
                                onChange={onChangeNota}
                            />
                        ))}

                    {isVivencia &&
                        ordem.map((g) => {
                            const items = grupos[g as string];
                            if (!items || items.length === 0) return null;

                            const titulo = g === "SEM_SUBGRUPO" ? "Geral" : LABEL_SUBGRUPO[g as SubGrupoVivencia];

                            return (
                                <div key={String(g)} className="space-y-2">
                                    <div className="px-1 pt-2 border-b border-gray-200 pb-1 mb-2">
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                                            {titulo}
                                        </span>
                                    </div>

                                    {items.map((sub) => (
                                        <EdicaoSubQuesitoInput
                                            key={sub.idSubequestios}
                                            subQuesito={sub}
                                            value={notas[sub.idSubequestios] ?? ""}
                                            onChange={onChangeNota}
                                        />
                                    ))}
                                </div>
                            );
                        })}

                    {/* Campo de Comentário Focado para Edição */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageSquare size={16} className="text-gray-500" />
                            Comentário da Avaliação Original
                        </label>
                        <textarea
                            value={comentarios?.[quesito?.idQuesito] ?? ""}
                            onChange={handleComentarioChange}
                            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none shadow-sm"
                            rows={3}
                            placeholder="Altere as observações registradas anteriormente..."
                        />
                    </div>
            </div>
        </div>
    );
}