import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { QuesitoDTO } from "../../types/Avaliacao";
import SubQuesitoInput from "../AvaliacaoPratica/SubQuesitoinput";

interface Props {
  quesito: QuesitoDTO;
  notas: Record<string, number>; // string para suportar prefixos
  comentarios?: Record<number, string>;
  onChangeNota: (idKey: string, nota: number) => void; // recebe chave prefixada
  onChangeComentario?: (quesitoId: number, comentario: string) => void;
}

export default function QuesitoCard({
  quesito,
  notas,
  comentarios,
  onChangeNota,
  onChangeComentario,
}: Props) {
  const [open, setOpen] = useState(true);
  const hasSubQuesitos = quesito.subQuesitos && quesito.subQuesitos.length > 0;

  return (
    <div className="border rounded-lg bg-gray-50">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{quesito.nomeQuesito}</span>
          <span className="text-xs text-gray-500">
            Nota Máx: {quesito.notaMaximaQuesito} pts
          </span>
        </div>

        <div
          className={`p-2 rounded-lg ${
            open ? "bg-primary text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 bg-gray-50">
          {!hasSubQuesitos ? (
            <div className="flex items-center justify-between border rounded-md px-4 py-2 bg-white">
              <label className="text-sm text-gray-700">Nota Final de acertos de questões</label>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{quesito.notaMaximaQuesito} pts</span>

                <input
                  type="number"
                  min={0}
                  max={quesito.notaMaximaQuesito}
                  value={notas[`quesito-${quesito.idQuesito}`] ?? ""}
                  onChange={(e) => onChangeNota(`quesito-${quesito.idQuesito}`, Number(e.target.value))}
                  className="w-24 p-2 border rounded"
                />
              </div>
            </div>
          ) : (
            <>
              {quesito.subQuesitos.map((sub) => (
                <SubQuesitoInput
                  key={`sub-${sub.idSubequestios}`}
                  subQuesito={sub}
                  value={notas[`sub-${sub.idSubequestios}`] ?? ""}
                  onChange={(id, nota) => onChangeNota(`sub-${id}`, nota)} // prefixa aqui
                />
              ))}

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comentário do quesito
                </label>
                <textarea
                  value={comentarios?.[quesito.idQuesito] ?? ""}
                  onChange={(e) => onChangeComentario?.(quesito.idQuesito, e.target.value)}
                  className="w-full p-3 rounded-md bg-white border border-gray-200 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Escreva um comentário sobre este quesito..."
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
