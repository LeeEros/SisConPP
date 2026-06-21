import { useState } from "react";
import { ChevronDown, ChevronRight, Edit3 } from "lucide-react";
import { ProvaAccordionDTO } from "../../types/Avaliacao";
import BlocoAccordion from "./EdicaoBlocoAccordion"; 

interface Props {
  prova: ProvaAccordionDTO;
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (subQuesitoId: number, nota: number) => void; 
  onChangeComentario: (id: number, comentario: string) => void; 
  categoriaSelecionada: number | null;
}

export default function EdicaoProvaAccordion({
  prova,
  notas,
  comentarios,
  onChangeNota,
  onChangeComentario,
  categoriaSelecionada
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`bg-white rounded-xl border transition-all overflow-hidden shadow-sm ${
        open
          ? "border-red-400 ring-1 ring-red-400/30"
          : "border-neutral-outline"
      }`}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg transition-colors ${
              open ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {prova?.nomeProva || "Prova"} 
              <Edit3 size={16} className="text-red-500 opacity-70" />
            </h3>
            <span className="text-sm text-gray-500">
              Nota Máx: {prova?.notaMaxima || 0}
            </span>
          </div>
        </div>
      </div>

      <div className={`p-4 bg-gray-50 space-y-4 ${open ? "block" : "hidden"}`}>
          {(!prova?.blocosProvas || prova.blocosProvas.length === 0) && (
            <p className="text-sm text-gray-400 italic">
              Nenhum bloco cadastrado nesta avaliação.
            </p>
          )}

          {prova?.blocosProvas?.map((bloco) => (
            <BlocoAccordion
              key={bloco.idBloco}
              bloco={bloco}
              notas={notas}
              comentarios={comentarios}
              onChangeNota={onChangeNota}
              onChangeComentario={onChangeComentario}
              categoriaSelecionada={categoriaSelecionada}
            />
          ))}
      </div>
    </div>
  );
}