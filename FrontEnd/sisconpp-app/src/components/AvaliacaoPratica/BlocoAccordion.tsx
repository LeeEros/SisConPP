import { useState } from "react";
import { toast } from "react-toastify";
import { ChevronDown, ChevronRight } from "lucide-react";
import { BlocoProvaDTO, QuesitoDTO } from "../../types/Avaliacao";
import QuesitoCard from "./QuesitoCard";

interface Props {
  bloco: BlocoProvaDTO;
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (subQuesitoId: number, nota: number) => void;
  onChangeComentario?: (quesitoId: number, comentario: string) => void;
  categoriaSelecionada: number | null;
}

function getLimiteOpcionais(categoriaId: number | null | undefined, tipoProva: string): number {
  if (!categoriaId) return 3;

  if (categoriaId === 2) {
    if(tipoProva === "Prova Artística" || tipoProva === "Artistica"){
      return 2
    }else if(tipoProva === "Prova Campeira" || tipoProva === "Campeira"){
      return 3
    }
  }

  if ([1, 3, 5, 7, 9].includes(categoriaId)) {
    return 3; 
  }

  if ([4, 6, 8, 10].includes(categoriaId)) {
    return 2;
  }

  return 0;
}

export default function BlocoAccordion({
  bloco,
  notas,
  comentarios,
  onChangeNota,
  onChangeComentario,
  categoriaSelecionada,
}: Props) {
  const [open, setOpen] = useState(true);
  const [selecionados, setSelecionados] = useState<number[]>([]);

  const limiteOpcionais = getLimiteOpcionais(categoriaSelecionada, bloco.nomeBloco);

  const handleToggleQuesito = (id: number) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((q) => q !== id));
    } else {
      if (selecionados.length < limiteOpcionais) {
        setSelecionados([...selecionados, id]);
      } else {
        toast.warn(`Você só pode selecionar até ${limiteOpcionais} quesitos opcionais neste bloco.`);
      }
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border transition-all overflow-hidden shadow-sm ${open ? "border-secondary ring-1 ring-secondary/30" : "border-neutral-outline"
        }`}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${open ? "bg-secondary text-white" : "bg-gray-200"}`}
          >
            {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          <div>
            <h4 className="font-semibold">{bloco.nomeBloco}</h4>
            <span className="text-xs text-gray-500">
              Nota Máx: {bloco.notaMaximaBloco}
            </span>
          </div>
        </div>
      </div>

      <div className={`p-4 bg-gray-50 space-y-4 ${open ? "block" : "hidden"}`}>
          {bloco.quesitos.length === 0 && (
            <p className="text-sm text-gray-400 italic">Nenhum quesito cadastrado.</p>
          )}

          {/* Quesitos obrigatórios */}
          {bloco.quesitos
            .filter((q: QuesitoDTO) => !q.opcional)
            .map((quesito) => (
              <QuesitoCard
                key={quesito.idQuesito}
                quesito={quesito}
                notas={notas}
                comentarios={comentarios}
                onChangeNota={onChangeNota}
                onChangeComentario={onChangeComentario}
              />
            ))}

          {bloco.quesitos.some((q) => q.opcional) && (
            <div className="border rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Quesitos opcionais (máx: {limiteOpcionais})
              </p>
              <div className="grid md:grid-cols-2 gap-1">
                {bloco.quesitos
                  .filter((q) => q.opcional)
                  .map((q) => (
                    <label key={q.idQuesito} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(q.idQuesito)}
                        onChange={() => handleToggleQuesito(q.idQuesito)}
                      />
                      <span>{q.nomeQuesito}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}

          {/* Renderiza opcionais escolhidos */}
          {selecionados.map((id) => {
            const q = bloco.quesitos.find((q) => q.idQuesito === id);
            if (!q) return null;
            return (
              <QuesitoCard
                key={q.idQuesito}
                quesito={q}
                notas={notas}
                comentarios={comentarios}
                onChangeNota={onChangeNota}
                onChangeComentario={onChangeComentario}
              />
            );
          })}
      </div>
    </div>
  );
}