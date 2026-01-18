import { useEffect, useState } from "react";
import { Concurso } from "../../types/Concurso";
import { toast } from "react-toastify";
import { Pencil, Trash2, Search, CalendarDays } from "lucide-react";
import Dialog from "../Modal/Dialog";
import { listarConcurso, deletarConcurso } from "../../services/api";
import Modal from "../Modal/Modal";
import ConcursoView from "../View/ConcursoView";

interface ConcursoListProps {
    onEdit: (concurso: Concurso) => void;
    onVisualizar: (concurso: Concurso) => void;
    onCredenciar: (concurso: Concurso) => void;
}

export default function ConcursoList({ onEdit }: ConcursoListProps) {
    const [concursos, setConcursos] = useState<Concurso[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [concursoSelecionadoId, setConcursoSelecionadoId] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedConcurso, setSelectedConcurso] = useState<Concurso | null>(null);

    const fetchConcursos = async () => {
        try {
            const response = await listarConcurso();
            setConcursos(response as Concurso[]);
        } catch (error) {
            toast.error("Erro ao carregar concursos.");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchConcursos();
    }, []);

    const handleConfirmDelete = async () => {
        if (!concursoSelecionadoId) return;

        try {
            await deletarConcurso(concursoSelecionadoId);
            toast.success("Concurso excluído com sucesso!");
            fetchConcursos();
            setIsDialogOpen(false);
            setConcursoSelecionadoId(null);
        } catch (error: unknown) {
            let msg = "Erro ao deletar Concurso.";
            if (error instanceof Object && "response" in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                if (apiError.response?.data?.message) {
                    msg = apiError.response.data.message;
                }
            }
            toast.error(msg);
            setIsDialogOpen(false);
            setConcursoSelecionadoId(null);
        }
    };

    const formatarData = (data: Date | string) => {
        if (!data) return "--/--/----";
        const dateObj = new Date(data);
        return dateObj.toLocaleDateString('pt-BR');
    };

    return (
        <div className="flex flex-col h-full bg-neutral-background p-6">
            <div className="bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Nome do Concurso</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Local</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Prova Escrita</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Provas Práticas</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {concursos.map((concurso) => (
                            <tr
                                key={concurso.idConcurso}
                                className="hover:bg-surface-container transition-colors"
                            >
                                <td className="p-4 text-neutral-onSurface font-medium">
                                    {concurso.nomeConcurso}
                                </td>
                                <td className="p-4 text-neutral-onSurface text-sm">
                                    {concurso.local}
                                </td>
                                <td className="p-4 text-neutral-onSurface text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={14} className="text-primary" />
                                        {formatarData(concurso.dataProvaEscrita)}
                                    </div>
                                </td>
                                <td className="p-4 text-neutral-onSurface text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={14} className="text-secondary" />
                                        {formatarData(concurso.dataProvasPraticas)}
                                    </div>
                                </td>
                                <td className="p-4 flex gap-2 justify-center">
                                    <button
                                        title="Visualizar"
                                        className="p-2 rounded-full text-primary hover:bg-primary-fixedDim/30 transition-all"
                                        onClick={() => {
                                            setSelectedConcurso(concurso);
                                            setIsViewModalOpen(true);
                                        }}
                                    >
                                        <Search size={18} />
                                    </button>

                                    <button
                                        title="Editar"
                                        className="p-2 rounded-full text-secondary hover:bg-secondary-fixedDim/30 transition-all"
                                        onClick={() => onEdit(concurso)}
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        title="Excluir"
                                        className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all"
                                        onClick={() => {
                                            setConcursoSelecionadoId(concurso.idConcurso);
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

                {concursos.length === 0 && (
                    <div className="p-8 text-center text-neutral-onVariant opacity-60">
                        Nenhum concurso encontrado.
                    </div>
                )}

                <Dialog
                    isOpen={isDialogOpen}
                    onClose={() => {
                        setIsDialogOpen(false);
                        setConcursoSelecionadoId(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    message="Tem certeza que deseja excluir este concurso?"
                />

                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                >
                    {selectedConcurso && (
                        <ConcursoView
                            concurso={selectedConcurso}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
}