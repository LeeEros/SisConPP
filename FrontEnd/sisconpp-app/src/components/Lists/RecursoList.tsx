import { Recurso } from "../../types/Recurso";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle
} from "lucide-react";

interface RecursoListProps {
  recursos: Recurso[];
  loading: boolean;
  onView: (recurso: Recurso) => void;
}

export default function RecursoList({ recursos, loading, onView }: RecursoListProps) {
  const formatDate = (iso?: string | Date | null) =>
    iso ? new Date(iso).toLocaleDateString("pt-BR") : "---";

  const renderStatusBadge = (status: Recurso["status"]) => {
    console.log("encontrou status:", status);
    if (status === "DEFERIDO") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
          <CheckCircle2 size={12} /> Deferido
        </span>
      );
    }    

    if (status === "INDEFERIDO") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
          <XCircle size={12} /> Indeferido
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
        <Clock size={12} /> Aguardando
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-onSurface opacity-60 gap-3 animate-pulse">
        <FileText size={40} className="text-primary" />
        <p className="text-sm font-medium">Carregando lista de recursos...</p>
      </div>
    );
  }

  if (recursos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-onSurface opacity-50 gap-3 border-2 border-dashed border-outline-variant rounded-xl m-4">
        <AlertCircle size={40} />
        <p className="text-lg font-medium">Nenhum recurso encontrado.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar h-full">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th className="p-4 font-semibold uppercase tracking-wider min-w-[220px]">
                Recurso / Motivo
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider min-w-[220px]">
                Candidato
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider min-w-[220px]">
                Avaliador
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider min-w-[200px]">
                Quesito
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider w-32">
                Data
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center w-36">
                Status
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center w-24">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant">
            {recursos.map((rec) => (
              <tr
                key={rec.idRecurso}
                className="hover:bg-surface-container transition-colors group"
              >
                <td className="p-4 align-middle">
                  <div className="flex flex-col max-w-[340px]">
                    <span
                      className="font-bold text-neutral-onSurface text-base truncate"
                      title={rec.nomeRecurso}
                    >
                      {rec.nomeRecurso}
                    </span>
                    <span
                      className="text-xs text-neutral-onSurface opacity-60 truncate"
                      title={rec.justificativa}
                    >
                      {rec.justificativa}
                    </span>
                  </div>
                </td>

                <td className="p-4 align-middle">
                  <span className="text-neutral-onSurface font-medium">
                    {rec.Candidato?.nomeCompleto ?? "---"}
                  </span>
                </td>

                <td className="p-4 align-middle">
                  <span className="text-neutral-onSurface font-medium">
                    {rec.Usuario?.nomeCompleto ?? "---"}
                  </span>
                </td>

                <td className="p-4 align-middle">
                  <span className="text-neutral-onSurface font-medium">
                    {rec.Quesito?.nomeQuesito ?? "---"}
                  </span>
                </td>

                <td className="p-4 align-middle text-neutral-onSurface opacity-80 text-xs">
                  {formatDate(rec.dataRecurso)}
                </td>

                <td className="p-4 align-middle text-center">
                  {renderStatusBadge(rec.status)}
                </td>

                <td className="p-4 align-middle text-center">
                  <button
                    onClick={() => onView(rec)}
                    className="p-2 rounded-lg text-primary hover:bg-primary-container hover:text-primary-dark transition-colors"
                    title="Ver Detalhes / Julgar"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}