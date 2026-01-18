import { SubQuesitoDTO } from "../../types/Avaliacao";
import { toast } from "react-toastify";

interface Props {
  subQuesito: SubQuesitoDTO;
  value?: number;
  onChange?: (subQuesitoId: number, nota: number) => void;
}

export default function SubQuesitoInput({ subQuesito, value, onChange }: Props) {
  const minAllowed = Math.min(0, subQuesito.notaSubequesito);
  const maxAllowed = Math.max(0, subQuesito.notaSubequesito);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === "") {
      return;
    }

    const nota = Number(raw);

    if (Number.isNaN(nota)) return;

    if (nota > maxAllowed) {
      toast.warning(`A nota não pode ser maior que ${maxAllowed} pts`);
      return;
    }

    if (nota < minAllowed) {
      toast.warning(`A nota não pode ser menor que ${minAllowed} pts`);
      return;
    }

    if (subQuesito.notaSubequesito > 0 && nota === maxAllowed) {
      toast.info(`Você atribuiu a nota máxima (${maxAllowed} pts) para este subquesito`);
    }

    onChange?.(subQuesito.idSubequestios, nota);
  };

  return (
    <div className="flex items-center justify-between border rounded-md px-4 py-2 bg-white">
      <span className="text-sm text-gray-800">{subQuesito.nomeSubquesito}</span>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">{subQuesito.notaSubequesito} pts</span>

        <input
          type="number"
          min={minAllowed}
          max={maxAllowed}
          step={0.1}
          value={value ?? ""}
          onChange={handleChange}
          className="w-20 h-8 border rounded-md text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>
    </div>
  );
}
