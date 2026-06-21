import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ChevronDown, ChevronRight, Edit3 } from "lucide-react";
import { BlocoProvaDTO, QuesitoDTO } from "../../types/Avaliacao";
import EdicaoQuesitoCard from "./EdicaoQuesitoCard";

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
    if (tipoProva === "Prova Artística" || tipoProva === "Artistica") {
      return 2;
    } else if (tipoProva === "Prova Campeira" || tipoProva === "Campeira") {
      return 3;
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

export default function EdicaoBlocoAccordion({
  bloco,
  notas,
  comentarios,
  onChangeNota,
  onChangeComentario,
  categoriaSelecionada,
}: Props) {
  const [open, setOpen] = useState(true);
  const [selecionados, setSelecionados] = useState<number[]>([]);

  // -------- CORREÇÃO: Verifica nota > 0 ou se existe comentário --------
  useEffect(() => {
    if (!bloco?.quesitos) return;

    const opcionaisPreAvaliados = bloco.quesitos
      .filter((q) => q.opcional)
      .filter((q) => {
        // 1. Tem algum comentário escrito?
        const temComentario = comentarios && comentarios[q.idQuesito] && comentarios[q.idQuesito].trim() !== "";
        
        // 2. Tem alguma nota MAIOR que zero? (A API retorna 0 para os não avaliados)
        const temNotaValida = notas && q.subQuesitos?.some((sub) => {
          const nota = notas[sub.idSubequestios];
          return nota !== undefined && nota !== null && Number(nota) > 0;
        });
        
        return temComentario || temNotaValida;
      })
      .map((q) => q.idQuesito);

    // Atualiza a lista de selecionados
    setSelecionados((prev) => {
      const faltantes = opcionaisPreAvaliados.filter((id) => !prev.includes(id));
      if (faltantes.length > 0) {
        return [...prev, ...faltantes];
      }
      return prev;
    });
  }, [bloco, notas, comentarios]);
  // ---------------------------------------------------------------------

  const nomeDoBloco = bloco?.nomeBloco || "";
  const limiteOpcionais = getLimiteOpcionais(categoriaSelecionada, nomeDoBloco);

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
      className={`bg-white rounded-xl border transition-all overflow-hidden shadow-sm ${
        open ? "border-orange-400 ring-1 ring-orange-400/30" : "border-neutral-outline"
      }`}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-orange-50/50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg transition-colors ${open ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              {nomeDoBloco || "Bloco sem nome"}
              <Edit3 size={14} className="text-orange-500 opacity-60" />
            </h4>
            <span className="text-xs text-gray-500">
              Nota Máx: {bloco?.notaMaximaBloco || 0}
            </span>
          </div>
        </div>
      </div>

      <div className={`p-4 bg-gray-50 space-y-4 ${open ? "block" : "hidden"}`}>
          {(!bloco?.quesitos || bloco.quesitos.length === 0) && (
            <p className="text-sm text-gray-400 italic">Nenhum quesito cadastrado neste bloco.</p>
          )}

          {/* Quesitos obrigatórios */}
          {bloco?.quesitos
            ?.filter((q: QuesitoDTO) => !q.opcional)
            .map((quesito) => (
              <EdicaoQuesitoCard
                key={quesito.idQuesito}
                quesito={quesito}
                notas={notas}
                comentarios={comentarios}
                onChangeNota={onChangeNota}
                onChangeComentario={onChangeComentario}
              />
            ))}

          {/* Renderização condicional dos opcionais */}
          {bloco?.quesitos?.some((q) => q.opcional) && (
            <div className="border border-orange-200 rounded-lg bg-orange-50/30 p-4">
              <p className="text-sm font-semibold text-orange-800 mb-2">
                Quesitos opcionais (máx: {limiteOpcionais})
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {bloco.quesitos
                  .filter((q) => q.opcional)
                  .map((q) => (
                    <label key={q.idQuesito} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-orange-100/50 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(q.idQuesito)}
                        onChange={() => handleToggleQuesito(q.idQuesito)}
                        className="accent-orange-600"
                      />
                      <span className="text-sm text-gray-700">{q.nomeQuesito}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}

          {/* Renderiza opcionais escolhidos */}
          {selecionados.map((id) => {
            const q = bloco?.quesitos?.find((q) => q.idQuesito === id);
            if (!q) return null;
            return (
              <EdicaoQuesitoCard
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