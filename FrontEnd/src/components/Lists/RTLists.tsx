import { useEffect, useState } from "react";
import { RT } from "../../types/RT";
import { listarRTs, deleteRT } from "../../services/api";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Dialog from "../Modal/Dialog";

interface RTListProps {
  onEdit: (rt: RT) => void;
}

export default function RTList({ onEdit }: RTListProps) {
  const [rts, setRTs] = useState<RT[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rtSelecionadoId, setRtSelecionadoId] = useState<number | null>(null);

  const fetchRTs = async () => {
    try {
      const response = (await listarRTs()) as RT[];
      // Opcional: Ordenar por número da RT
      const sorted = response.sort((a, b) => a.numeroRT - b.numeroRT);
      setRTs(sorted);
    } catch (error) {
      toast.error("Erro ao carregar RTs");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRTs();
  }, []);

  const handleConfirmDelete = async () => {
    if (!rtSelecionadoId) return;

    try {
      await deleteRT(rtSelecionadoId);
      toast.success("RT excluída com sucesso!");
      fetchRTs();
      setIsDialogOpen(false);
      setRtSelecionadoId(null);
    } catch (error: unknown) {
      let msg = "Erro ao deletar RT.";
      if (error instanceof Object && "response" in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          msg = apiError.response.data.message;
        }
      }
      toast.error(msg);
      setIsDialogOpen(false);
      setRtSelecionadoId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-background p-6">
      <div className="bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Nome da Região</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Número</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {rts.map((rt) => (
              <tr
                key={rt.idRT}
                className="hover:bg-surface-container transition-colors"
              >
                <td className="p-4 text-neutral-onSurface font-medium">{rt.nomeRT}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-container text-primary-onContainer">
                    {rt.numeroRT}ª RT
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button
                    title="Editar"
                    className="p-2 rounded-full text-secondary hover:bg-secondary-fixedDim/30 transition-all"
                    onClick={() => onEdit(rt)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    title="Excluir"
                    className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all"
                    onClick={() => {
                      setRtSelecionadoId(rt.idRT);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rts.length === 0 && (
          <div className="p-8 text-center text-neutral-onVariant opacity-60">
            Nenhuma RT cadastrada.
          </div>
        )}

        <Dialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setRtSelecionadoId(null);
          }}
          onConfirm={handleConfirmDelete}
          message="Tem certeza que deseja excluir esta Região Tradicionalista? Isso pode afetar CTGs vinculados."
        />
      </div>
    </div>
  );
}