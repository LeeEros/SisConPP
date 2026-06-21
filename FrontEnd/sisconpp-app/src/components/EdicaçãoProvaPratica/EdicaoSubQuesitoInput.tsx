import { SubQuesitoDTO } from "../../types/Avaliacao";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";

interface Props {
  subQuesito: SubQuesitoDTO;
  value?: number | string;
  onChange?: (subQuesitoId: number, nota: number) => void;
}

export default function EdicaoSubQuesitoInput({ subQuesito, value, onChange }: Props) {
  // Proteções de segurança
  if (!subQuesito) return null;

  const minAllowed = Math.min(0, subQuesito.notaSubequesito || 0);
  const maxAllowed = Math.max(0, subQuesito.notaSubequesito || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === "") {
      return; // Permite apagar temporariamente
    }

    const nota = Number(raw);

    if (Number.isNaN(nota)) return;

    if (nota > maxAllowed) {
      toast.warning(`A nota editada não pode ser maior que ${maxAllowed} pts`);
      return;
    }

    if (nota < minAllowed) {
      toast.warning(`A nota editada não pode ser menor que ${minAllowed} pts`);
      return;
    }

    onChange?.(subQuesito.idSubequestios, nota);
  };

  return (
    <div className="flex items-center justify-between border border-gray-200 hover:border-gray-300 rounded-md px-4 py-2 bg-white transition-colors">
      <span className="text-sm text-gray-700 font-medium">{subQuesito.nomeSubquesito || "Subquesito"}</span>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 font-semibold">{maxAllowed} pts</span>

        <div className="relative">
          <input
            type="number"
            min={minAllowed}
            max={maxAllowed}
            step={0.1}
            value={value ?? ""}
            onChange={handleChange}
            className="w-24 h-9 border-2 border-orange-200 bg-orange-50 text-orange-900 rounded-md text-center text-sm font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            placeholder="0.0"
          />
          {value !== "" && value !== undefined && (
            <AlertCircle size={12} className="absolute -top-1 -right-1 text-orange-500 bg-white rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}