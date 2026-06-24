import { useEffect, useState } from "react";
import { listarCTGs, deleteCTG, listarRTs } from "../../services/api";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import { CTG } from "../../types/CTG";
import Dialog from "../Modal/Dialog";

interface CTGListProps {
  onEdit: (ctg: CTG) => void;
}

interface RT {
  idRT: number;
  nomeRT: string;
}

export default function CTGList({ onEdit }: CTGListProps) {
  const [ctgs, setCTGs] = useState<CTG[]>([]);
  const [rts, setRTs] = useState<RT[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ctgSelecionadoId, setCtgSelecionadoId] = useState<number | null>(null);

  const fetchCTGs = async () => {
    try {
      const response = (await listarCTGs()) as CTG[];
      setCTGs(response);
    } catch (error) {
      toast.error("Erro ao carregar CTGs");
      console.error(error);
    }
  };

  const fetchRTs = async () => {
    try {
      const response = (await listarRTs()) as RT[];
      setRTs(response);
    } catch (error) {
      toast.error("Erro ao carregar RTs");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCTGs();
    fetchRTs();
  }, []);

  const handleConfirmDelete = async () => {
    if (!ctgSelecionadoId) return;

    try {
      await deleteCTG(ctgSelecionadoId);
      toast.success("CTG excluído com sucesso!");
      fetchCTGs();
      setIsDialogOpen(false);
      setCtgSelecionadoId(null);
    } catch (error: unknown) {
      let msg = "Erro ao deletar CTG.";
      if (error instanceof Object && "response" in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          msg = apiError.response.data.message;
        }
      }
      toast.error(msg);
      setIsDialogOpen(false);
      setCtgSelecionadoId(null);
    }
  };

  const getRTNameById = (id: number) => {
    const rt = rts.find((rt) => rt.idRT === id);
    return rt ? rt.nomeRT : "RT não encontrada";
  };

  return (
    <div className="flex flex-col h-full bg-neutral-background p-6">
      <div className="bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Nome CTG</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Região Tradicionalista</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {ctgs.map((ctg) => (
              <tr
                key={ctg.idCTG}
                className="hover:bg-surface-container transition-colors"
              >
                <td className="p-4 text-neutral-onSurface font-medium">{ctg.nomeCTG}</td>
                <td className="p-4 text-neutral-onSurface text-sm">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary-container text-secondary-onContainer">
                    {getRTNameById(ctg.RTid)}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button
                    title="Editar"
                    className="p-2 rounded-full text-secondary hover:bg-secondary-fixedDim/30 transition-all"
                    onClick={() => onEdit(ctg)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    title="Excluir"
                    className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all"
                    onClick={() => {
                      setCtgSelecionadoId(ctg.idCTG);
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

        {ctgs.length === 0 && (
          <div className="p-8 text-center text-neutral-onVariant opacity-60">
            Nenhum CTG cadastrado.
          </div>
        )}

        <Dialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setCtgSelecionadoId(null);
          }}
          onConfirm={handleConfirmDelete}
          message="Tem certeza que deseja excluir este CTG?"
        />
      </div>
    </div>
  );
}