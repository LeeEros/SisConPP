import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Music } from "lucide-react";
import { QuesitoDTO, SubGrupoVivencia } from "../../types/Avaliacao";
import SubQuesitoInput from "./SubQuesitoinput";

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

export default function QuesitoCard({
    quesito,
    notas,
    onChangeNota,
    onChangeComentario,
}: Props) {
    const [open, setOpen] = useState(true);
    const [comentario, setComentario] = useState("");

    const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setComentario(value);
        onChangeComentario?.(quesito.idQuesito, value);
    };

    const isVivencia = isVivenciaQuesito(quesito.nomeQuesito);

    const grupos = useMemo(() => {
        const acc = quesito.subQuesitos.reduce((map, sub) => {
            const key = (sub.subGrupo ?? "SEM_SUBGRUPO") as SubGrupoVivencia | "SEM_SUBGRUPO";
            (map[key] ??= []).push(sub);
            return map;
        }, {} as Record<SubGrupoVivencia | "SEM_SUBGRUPO", typeof quesito.subQuesitos>);
        return acc;
    }, [quesito.subQuesitos]);

    const ordem: (SubGrupoVivencia | "SEM_SUBGRUPO")[] = [
        SubGrupoVivencia.APRESENTACAO_PASTA,
        SubGrupoVivencia.APROVEITAMENTO_TEMPO,
        SubGrupoVivencia.COLABORACAO_PROMOCOES,
        SubGrupoVivencia.PARTICIPACAO_EVENTOS,
        "SEM_SUBGRUPO",
    ];

    const metaDanca = (quesito as unknown as Record<string, unknown>).metaDanca as
        | {
            tipo: "DANCA_DE_SALAO" | "DANCA_TRADICIONAL";
            possuiSorteio: boolean;
            sorteada: string | null;
            escolhidas: string[] | null;
            textoExibicao: string | null;
        }
        | undefined;

    return (
        <div className="border rounded-lg bg-gray-50">
            {/* Cabeçalho do Acordeão */}
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            >
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-800 text-lg">{quesito.nomeQuesito}</span>

                    <span className="text-xs text-gray-500 font-medium mt-1">
                        Nota Máxima: {quesito.notaMaximaQuesito} pts
                    </span>

                    {metaDanca?.textoExibicao && (
                        <div className="flex items-center gap-2 mt-1 bg-primary-container/30 text-primary-dark px-3 py-1.5 rounded-md w-fit">
                            <Music size={16} className="text-primary" />
                            <span className="text-sm font-medium">
                                {metaDanca.textoExibicao}
                            </span>
                        </div>
                    )}
                    
                </div>

                <div
                    className={`p-2 rounded-lg transition-all ${
                        open
                            ? "bg-primary text-white shadow-sm"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                >
                    {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
            </div>

            {open && (
                <div className="px-4 pb-4 space-y-4 bg-gray-50 border-t border-gray-100 pt-4">
                    {quesito.subQuesitos.length === 0 && (
                        <p className="text-sm text-gray-400 italic text-center py-2">Nenhum subquesito cadastrado.</p>
                    )}

                    {!isVivencia &&
                        quesito.subQuesitos.map((sub) => (
                            <SubQuesitoInput
                                key={sub.idSubequestios}
                                subQuesito={sub}
                                value={notas[sub.idSubequestios] ?? ""}
                                onChange={onChangeNota}
                            />
                        ))}

                    {isVivencia &&
                        ordem.map((g) => {
                            const items = grupos[g];
                            if (!items || items.length === 0) return null;

                            const titulo = g === "SEM_SUBGRUPO" ? "Geral" : LABEL_SUBGRUPO[g];

                            return (
                                <div key={String(g)} className="space-y-2">
                                    <div className="px-1 pt-2 border-b border-gray-200 pb-1 mb-2">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                                            {titulo}
                                        </span>
                                    </div>

                                    {items.map((sub) => (
                                        <SubQuesitoInput
                                            key={sub.idSubequestios}
                                            subQuesito={sub}
                                            value={notas[sub.idSubequestios] ?? ""}
                                            onChange={onChangeNota}
                                        />
                                    ))}
                                </div>
                            );
                        })}

                    {/* Campo de Comentário */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            Comentário do Avaliador <span className="text-gray-400 font-normal text-xs"></span>
                        </label>
                        <textarea
                            value={comentario}
                            onChange={handleComentarioChange}
                            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none shadow-sm"
                            rows={3}
                            placeholder="Registre aqui suas observações sobre este quesito..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}