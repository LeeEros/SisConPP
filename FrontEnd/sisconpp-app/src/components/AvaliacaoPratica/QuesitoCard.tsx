import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { QuesitoDTO, SubGrupoVivencia } from "../../types/Avaliacao";
import SubQuesitoInput from "./SubQuesitoinput";

interface Props {
  quesito: QuesitoDTO;
  notas: Record<number, number>;
  comentarios: Record<number, string>;
  onChangeNota: (subQuesitoId: number, nota: number) => void;
  onChangeComentario?: (quesitoId: number, comentario: string) => void;
}

const LABEL_SUBGRUPO: Record<SubGrupoVivencia, string> = {
  [SubGrupoVivencia.APRESENTACAO_PASTA]: "Apresentação da pasta de vivência",
  [SubGrupoVivencia.APROVEITAMENTO_TEMPO]: "Aproveitamento do tempo no movimento tradicionalista",
  [SubGrupoVivencia.COLABORACAO_PROMOCOES]: "Colaboração na organização de promoções tradicionalistas",
  [SubGrupoVivencia.PARTICIPACAO_EVENTOS]: "Participação ou frequência em eventos tradicionalistas",
};

function isVivenciaQuesito(nome?: string) {
  return (nome ?? "").toLowerCase().includes("vivência tradicionalista");
}

export default function QuesitoCard({
  quesito,
  notas,
  onChangeNota,
  onChangeComentario,
}: Props) {
  const [open, setOpen] = useState(true);
  const [comentario, setComentario] = useState("");

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComentario(value);
    onChangeComentario?.(quesito.idQuesito, value);
  };

  const isVivencia = isVivenciaQuesito(quesito.nomeQuesito);
  const grupos = useMemo(() => {
    const acc = quesito.subQuesitos.reduce((map, sub) => {
      const key = (sub.subGrupo ?? "SEM_SUBGRUPO") as SubGrupoVivencia | "SEM_SUBGRUPO";
      (map[key] ??= []).push(sub);
      return map;
    }, {} as Record<SubGrupoVivencia | "SEM_SUBGRUPO", typeof quesito.subQuesitos>);

    return acc;
  }, [quesito.subQuesitos]);

  const ordem: (SubGrupoVivencia | "SEM_SUBGRUPO")[] = [
    SubGrupoVivencia.APRESENTACAO_PASTA,
    SubGrupoVivencia.APROVEITAMENTO_TEMPO,
    SubGrupoVivencia.COLABORACAO_PROMOCOES,
    SubGrupoVivencia.PARTICIPACAO_EVENTOS,
    "SEM_SUBGRUPO",
  ];

  return (
    <div className="border rounded-lg bg-gray-50">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{quesito.nomeQuesito}</span>
          <span className="text-xs text-gray-500">
            Nota Máx: {quesito.notaMaximaQuesito} pts
          </span>
        </div>

        <div
          className={`p-2 rounded-lg ${open ? "bg-primary text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
        >
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 bg-gray-50">
          {quesito.subQuesitos.length === 0 && (
            <p className="text-sm text-gray-400 italic">Nenhum subquesito cadastrado.</p>
          )}

          {/* ✅ Render normal quando NÃO for Vivência */}
          {!isVivencia &&
            quesito.subQuesitos.map((sub) => (
              <SubQuesitoInput
                key={sub.idSubequestios}
                subQuesito={sub}
                value={notas[sub.idSubequestios] ?? ""}
                onChange={onChangeNota}
              />
            ))}

          {/* ✅ Render agrupado quando for Vivência */}
          {isVivencia &&
            ordem.map((g) => {
              const items = grupos[g];
              if (!items || items.length === 0) return null;

              const titulo = g === "SEM_SUBGRUPO" ? "Sem subgrupo" : LABEL_SUBGRUPO[g];

              return (
                <div key={String(g)} className="space-y-2">
                  <div className="px-1 pt-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {titulo}
                    </span>
                  </div>

                  {items.map((sub) => (
                    <SubQuesitoInput
                      key={sub.idSubequestios}
                      subQuesito={sub}
                      value={notas[sub.idSubequestios] ?? ""}
                      onChange={onChangeNota}
                    />
                  ))}
                </div>
              );
            })}

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comentário do quesito
            </label>
            <textarea
              value={comentario}
              onChange={handleComentarioChange}
              className="w-full p-3 rounded-md bg-white 
               border border-gray-200 text-gray-700 text-sm 
               focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="Escreva um comentário sobre este quesito..."
            />
          </div>
        </div>
      )}
    </div>
  );
}