import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { ProvaPratica } from "../../types/ProvaPratica";
import BlocoItem from "./BlocoItem";

export interface ProvaAccordionProps {
  prova: ProvaPratica;
  isOpen: boolean;
  onToggle: (provaId: number) => void;
  blocosAbertos: Set<number>;
  onToggleBloco: (blocoId: number) => void;
  quesitosAbertos: Set<number>;
  onToggleQuesito: (quesitoId: number) => void;
  onAddBloco: (provaId: number) => void;
  onAddQuesito: (blocoId: number) => void;
  onAddSub: (quesitoId: number) => void;
}

export default function ProvaAccordion({
  prova,
  isOpen,
  onToggle,
  blocosAbertos,
  onToggleBloco,
  quesitosAbertos,
  onToggleQuesito,
  onAddBloco,
  onAddQuesito,
  onAddSub,
}: ProvaAccordionProps) {
  return (
    <div
      className={`bg-white rounded-xl border transition-all overflow-hidden shadow-sm ${isOpen ? "border-primary ring-1 ring-primary/30" : "border-neutral-outline"
        }`}
    >
      <div
        onClick={() => onToggle(prova.idProvaPratica)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isOpen ? "bg-primary text-white" : "bg-gray-200"}`}>
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          <div>
            <h3 className="text-lg font-bold">{prova.nomeProva}</h3>
            <span className="text-sm text-gray-500">
              Nota Máx: {prova.notaMaxima}
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-50 space-y-4">
          {prova.blocosProvas.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Nenhum bloco cadastrado.
            </p>
          )}

          {prova.blocosProvas.map((bloco) => (
            <BlocoItem
              key={bloco.idBloco}
              bloco={bloco}
              isOpen={blocosAbertos.has(bloco.idBloco!)}
              onToggle={onToggleBloco}
              quesitosAbertos={quesitosAbertos}
              onToggleQuesito={onToggleQuesito}
              onAddQuesito={onAddQuesito}
              onAddSub={onAddSub}
            />
          ))}

          <button
            onClick={() => onAddBloco(prova.idProvaPratica)}
            className=" w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-semibold transition-all hover:border-secondary hover:text-secondary " 
          >
            <Plus size={18} /> Adicionar Bloco
          </button>
        </div>
      )}
    </div>
  );
}
