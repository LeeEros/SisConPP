import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Quesitos } from "../../types/ProvaTeorica";

interface QuesitoItemProps {
  quesito: Quesitos;
  isOpen: boolean;
  onToggle: (idQuesito: number) => void;
  onAddSub: (quesitoId: number) => void;
}

export default function QuesitoItem({
  quesito,
  isOpen,
  onToggle,
  onAddSub,
}: QuesitoItemProps) {

  const quesitoId = quesito.idQuesito;

  return (
    <div className="border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between p-3">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {quesito.nomeQuesito}
          </span>
          <span className="text-xs text-gray-500">
            Nota máx: {quesito.notaMaximaQuesito} pts
          </span>
        </div>

        <button
          type="button"
          disabled={!quesitoId}
          onClick={() => quesitoId && onToggle(quesitoId)}
          className={`p-2 rounded-lg transition-colors ${
            isOpen
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="p-3 pt-0 space-y-2">
          {quesito.subQuesitos?.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Nenhum subquesito cadastrado.
            </p>
          )}

          {quesito.subQuesitos?.map((sub) => (
            <div
              key={sub.idSubequestios}
              className="flex justify-between items-center bg-white p-2 rounded border"
            >
              <span className="text-sm">{sub.nomeSubquesito}</span>
              <span className="text-xs font-bold">
                {sub.notaSubequesito} pts
              </span>
            </div>
          ))}

          <button
            type="button"
            disabled={!quesitoId}
            onClick={() => quesitoId && onAddSub(quesitoId)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-semibold transition-all hover:border-secondary hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Adicionar SubQuesito
          </button>
        </div>
      )}
    </div>
  );
}
