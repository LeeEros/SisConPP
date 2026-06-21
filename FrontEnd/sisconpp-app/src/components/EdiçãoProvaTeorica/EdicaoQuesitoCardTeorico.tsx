import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { QuesitoDTO } from "../../types/Avaliacao";
import EdicaoSubQuesitoInput from "./EdicaoSubQuesitoInput"; 

interface Props {
    quesito: QuesitoDTO;
    notas: Record<number, number>;
    comentarios?: Record<number, string>;
    onChangeNota: (id: number, nota: number) => void;
    onChangeComentario?: (quesitoId: number, comentario: string) => void;
}

export default function EdicaoQuesitoCardTeorico({
    quesito,
    notas,
    comentarios,
    onChangeNota,
    onChangeComentario,
}: Props) {
    const [open, setOpen] = useState(true);

    const hasSubQuesitos = quesito?.subQuesitos && quesito.subQuesitos.length > 0;

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            >
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{quesito?.nomeQuesito || "Quesito"}</span>
                    <span className="text-xs text-gray-500">
                        Nota Máx: {quesito?.notaMaximaQuesito || 0} pts
                    </span>
                </div>

                <div
                    className={`p-2 rounded-lg transition-all ${
                        open ? "bg-gray-800 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                    {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
            </div>

            {open && (
                <div className="px-4 pb-4 space-y-3 bg-gray-50 border-t border-gray-100 pt-4">
                    {!hasSubQuesitos ? (
                        <div className="flex items-center justify-between border border-orange-200 rounded-md px-4 py-3 bg-white">
                            <label className="text-sm text-gray-700 font-medium">Nota Final deste Quesito</label>

                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 font-semibold">
                                    {quesito?.notaMaximaQuesito || 0} pts máx
                                </span>

                                <input
                                    type="number"
                                    min={0}
                                    max={quesito?.notaMaximaQuesito || 0}
                                    step={0.1}
                                    value={notas[quesito?.idQuesito] ?? ""}
                                    onChange={(e) => onChangeNota(quesito.idQuesito, Number(e.target.value))}
                                    className="w-24 h-9 border-2 border-orange-200 bg-orange-50 text-orange-900 rounded-md text-center text-sm font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                    placeholder="0.0"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {quesito?.subQuesitos?.map((sub) => (
                                <EdicaoSubQuesitoInput
                                    key={sub.idSubequestios}
                                    subQuesito={sub}
                                    value={notas[sub.idSubequestios] ?? ""}
                                    onChange={onChangeNota}
                                />
                            ))}
                        </>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageSquare size={16} className="text-gray-500" />
                            Comentário da Avaliação Original
                        </label>
                        <textarea
                            value={comentarios?.[quesito?.idQuesito] ?? ""}
                            onChange={(e) => onChangeComentario?.(quesito.idQuesito, e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none shadow-sm"
                            rows={3}
                            placeholder="Altere as observações registradas anteriormente..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}