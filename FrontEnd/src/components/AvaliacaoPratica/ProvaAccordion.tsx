import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ProvaAccordionDTO } from "../../types/Avaliacao";
import BlocoAccordion from "./BlocoAccordion";

interface Props {
  prova: ProvaAccordionDTO;
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (subQuesitoId: number, nota: number) => void; 
  onChangeComentario: (id: number, comentario: string) => void; 
  categoriaSelecionada: number | null;
}

export default function ProvaAccordion({
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
          ? "border-primary ring-1 ring-primary/30"
          : "border-neutral-outline"
      }`}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg ${
              open ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          <div>
            <h3 className="text-lg font-bold">{prova.nomeProva}</h3>
            <span className="text-sm text-gray-500">
              Nota Máx: {prova.notaMaxima}
            </span>
          </div>
        </div>
      </div>

      <div className={`p-4 bg-gray-50 space-y-4 ${open ? "block" : "hidden"}`}>
          {prova.blocosProvas.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Nenhum bloco cadastrado.
            </p>
          )}

          {prova.blocosProvas.map((bloco) => (
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
