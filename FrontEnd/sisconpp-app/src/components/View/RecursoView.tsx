import { Recurso } from "../../types/Recurso";
import { FileText, User, ClipboardList } from "lucide-react";

type Props = {
  recurso: Recurso;
  onClose: () => void;
  onIndeferir: () => void;
  onDeferir: () => void;
};

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

const getStatusStyle = (status?: string | null) => {
  if (status === "DEFERIDO") return "bg-green-100 text-green-800 border-green-200";
  if (status === "INDEFERIDO") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
};

const getStatusLabel = (status?: string | null) => {
  if (status === "DEFERIDO") return "DEFERIDO";
  if (status === "INDEFERIDO") return "INDEFERIDO";
  return "AGUARDANDO";
};

export default function RecursoView({ recurso, onClose, onIndeferir, onDeferir }: Props) {
  return (
    <div className="w-full text-neutral-onBackground p-2">
      {/* HEADER */}
      <div className="mb-6 border-b border-outline-variant pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
            <FileText className="text-primary" /> Análise de Recurso
          </h2>

          <p className="text-sm opacity-60 mt-1">
            Data: {formatDateTime(recurso.dataRecurso)}
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(recurso.status)}`}>
          {getStatusLabel(recurso.status)}
        </div>
      </div>

      <div className="space-y-6">
        {/* INFO */}
        <div className="bg-surface-containerLowest p-4 rounded-xl border border-outline-variant shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-primary uppercase mb-1 flex items-center gap-1">
                <User size={12} /> Candidato
              </label>
              <p className="font-medium text-lg">{recurso.Candidato?.nomeCompleto ?? "N/A"}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-primary uppercase mb-1">
                Avaliador
              </label>
              <p className="font-medium">{recurso.Usuario?.nomeCompleto ?? "N/A"}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-primary uppercase mb-1 flex items-center gap-1">
                <ClipboardList size={12} /> Quesito do Recurso
              </label>
              <p className="font-medium">{recurso.Quesito?.nomeQuesito ?? "N/A"}</p>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-neutral-onSurface">
            Objeto do Recurso
          </label>
          <div className="p-3 bg-surface-containerHigh rounded-lg text-sm font-medium border border-outline-variant">
            {recurso.nomeRecurso}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-neutral-onSurface">
            Justificativa Detalhada
          </label>
          <div className="p-4 bg-surface-containerLowest rounded-xl border border-outline-variant text-sm leading-relaxed whitespace-pre-wrap min-h-[100px] shadow-inner">
            {recurso.justificativa}
          </div>
        </div>
      </div>

      {/* AÇÕES */}
      <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2.5 border border-outline rounded-xl text-neutral-onSurface hover:bg-surface-variant transition font-medium"
        >
          Fechar
        </button>

        <button
          onClick={onIndeferir}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-xl font-bold transition transform active:scale-95"
        >
          Indeferir
        </button>

        <button
          onClick={onDeferir}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md transition transform active:scale-95"
        >
          Deferir
        </button>
      </div>
    </div>
  );
}
