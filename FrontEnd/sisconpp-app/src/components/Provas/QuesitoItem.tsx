import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Quesitos, SubGrupoVivencia } from "../../types/ProvaPratica";

interface QuesitoItemProps {
  quesito: Quesitos;
  isOpen: boolean;
  onToggle: (idQuesito: number) => void;
  onAddSub: (quesitoId: number) => void;
}

const LABEL_SUBGRUPO: Record<SubGrupoVivencia, string> = {
  APRESENTACAO_PASTA: "Apresentação da pasta de vivência",
  APROVEITAMENTO_TEMPO: "Aproveitamento do tempo no movimento tradicionalista",
  COLABORACAO_PROMOCOES: "Colaboração na organização de promoções tradicionalistas",
  PARTICIPACAO_EVENTOS: "Participação ou frequência em eventos tradicionalistas",
};

function isVivenciaQuesito(nomeQuesito?: string) {
  return (nomeQuesito ?? "").toLowerCase().includes("vivência tradicionalista");
}

export default function QuesitoItem({
  quesito,
  isOpen,
  onToggle,
  onAddSub,
}: QuesitoItemProps) {
  const isVivencia = isVivenciaQuesito(quesito.nomeQuesito);

  // Agrupa subquesitos por subGrupo (para Vivência)
  const subQuesitos = quesito.subQuesitos ?? [];
  const grupos = subQuesitos.reduce((acc, sub) => {
    const key = (sub.subGrupo ?? "SEM_SUBGRUPO") as
      | SubGrupoVivencia
      | "SEM_SUBGRUPO";
    (acc[key] ??= []).push(sub);
    return acc;
  }, {} as Record<SubGrupoVivencia | "SEM_SUBGRUPO", typeof subQuesitos>);

  const ordemGrupos: (SubGrupoVivencia | "SEM_SUBGRUPO")[] = [
    SubGrupoVivencia.APRESENTACAO_PASTA,
    SubGrupoVivencia.APROVEITAMENTO_TEMPO,
    SubGrupoVivencia.COLABORACAO_PROMOCOES,
    SubGrupoVivencia.PARTICIPACAO_EVENTOS,
    "SEM_SUBGRUPO",
  ];

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
          onClick={() => onToggle(quesito.idQuesito!)}
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
          {subQuesitos.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Nenhum subquesito cadastrado.
            </p>
          )}

          {/* ✅ Render normal (quando NÃO é vivência) */}
          {!isVivencia &&
            subQuesitos.map((sub) => (
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

          {/* ✅ Render agrupado (quando é vivência) */}
          {isVivencia &&
            ordemGrupos.map((grupoKey) => {
              const items = grupos[grupoKey];
              if (!items || items.length === 0) return null;

              const titulo =
                grupoKey === "SEM_SUBGRUPO"
                  ? "Sem subgrupo"
                  : LABEL_SUBGRUPO[grupoKey];

              return (
                <div key={String(grupoKey)} className="space-y-2">
                  <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {titulo}
                    </span>

                    {/* opcional: subtotal do grupo (mantém discreto) */}
                    <span className="text-xs font-semibold text-gray-500">
                      {items
                        .reduce((sum, s) => sum + Number(s.notaSubequesito || 0), 0)
                        .toFixed(1)}{" "}
                      pts
                    </span>
                  </div>

                  {items.map((sub) => (
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
                </div>
              );
            })}

          <button
            type="button"
            onClick={() => onAddSub(quesito.idQuesito!)}
            className=" w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-semibold transition-all hover:border-secondary hover:text-secondary "
          >
            <Plus size={16} />
            Adicionar SubQuesito
          </button>
        </div>
      )}
    </div>
  );
}