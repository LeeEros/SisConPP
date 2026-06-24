import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { ProvaTeorica } from "../../types/ProvaTeorica";
import QuesitoItemTeorica from "./QuesitoItemTeorica";

export interface ProvaAccordionProps {
  prova: ProvaTeorica;
  isOpen: boolean;
  onToggle: (provaId: number) => void;
  quesitosAbertos: Set<number>;
  onToggleQuesito: (quesitoId: number) => void;
  onAddQuesito: (provaId: number) => void;
  onAddSub: (quesitoId: number) => void;
}

export default function ProvaAccordionTeorica({
  prova,
  isOpen,
  onToggle,
  quesitosAbertos,
  onToggleQuesito,
  onAddQuesito,
  onAddSub,
}: ProvaAccordionProps) {
  return (
    <div
      className={`bg-white rounded-xl border transition-all overflow-hidden shadow-sm ${
        isOpen
          ? "border-primary ring-1 ring-primary/30"
          : "border-neutral-outline"
      }`}
    >
      <div
        onClick={() =>
          prova.idprovaTeorica && onToggle(prova.idprovaTeorica)
        }
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg ${
              isOpen ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {isOpen ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
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
          {prova.quesitos.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Nenhum Quesito Encontrado
            </p>
          )}

          {prova.quesitos.map((q) => (
            <QuesitoItemTeorica
              key={q.idQuesito!}
              quesito={q}
              isOpen={quesitosAbertos.has(q.idQuesito!)}
              onToggle={onToggleQuesito}
              onAddSub={onAddSub}
            />
          ))}

          <button
            type="button"
            onClick={() =>
              prova.idprovaTeorica && onAddQuesito(prova.idprovaTeorica)
            }
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-semibold transition-all hover:border-primary hover:text-primary"
          >
            <Plus size={16} />
            Adicionar Quesito
          </button>
        </div>
      )}
    </div>
  );
}
