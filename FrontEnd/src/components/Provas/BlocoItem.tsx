import { BlocoProva } from "../../types/ProvaPratica";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import QuesitoItem from "./QuesitoItem";

interface BlocoItemProps {
  bloco: BlocoProva;
  isOpen: boolean;
  onToggle: (idBloco: number) => void;
  quesitosAbertos: Set<number>;
  onToggleQuesito: (idQuesito: number) => void;
  onAddQuesito: (blocoId: number) => void;
  onAddSub: (quesitoId: number) => void;
}

export default function BlocoItem({
  bloco,
  isOpen,
  onToggle,
  quesitosAbertos,
  onToggleQuesito,
  onAddQuesito,
  onAddSub,
}: BlocoItemProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="flex items-center justify-between p-3">
        <div>
          <strong>{bloco.nomeBloco}</strong>
          <p className="text-xs">Nota máx: {bloco.notaMaximaBloco}</p>
        </div>

        <button
          type="button"
          onClick={() => onToggle(bloco.idBloco!)}
          className={`p-2 rounded-lg ${
            isOpen ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </button>
      </div>

      {isOpen && (
        <div className="p-3 space-y-3 border-t bg-gray-50">
          {bloco.quesitos?.map((q) => (
            <QuesitoItem
              key={q.idQuesito}
              quesito={q}
              isOpen={quesitosAbertos.has(q.idQuesito!)}
              onToggle={onToggleQuesito}
              onAddSub={onAddSub}
            />
          ))}

          <button
            type="button"
            onClick={() => onAddQuesito(bloco.idBloco!)}
            className=" w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-semibold transition-all hover:border-secondary hover:text-secondary " 
          >
            <Plus size={16} />
            Adicionar Quesito
          </button>
        </div>
      )}
    </div>
  );
}
