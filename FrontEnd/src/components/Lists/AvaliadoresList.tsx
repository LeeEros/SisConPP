import { useEffect, useState } from "react";
import { listarUsuriosAvaliadores as listarAvaliadores, deleteUsuario, listarCTGs } from "../../services/api";
import { toast } from "react-toastify";
import { Pencil, Trash2, Search, BadgeCheck} from "lucide-react";
import { Usuario, Credenciamento } from "../../types/Usuario";
import { CTG } from "../../types/CTG";
import Dialog from "../Modal/Dialog";
import AvaliadorView from "../View/AvaliadorView";
import Modal from "../Modal/Modal";

interface AvaliadorListProps {
    onEdit: (avaliador: Usuario) => void;
    onVisualizar: (avaliador: Usuario) => void;
    onCredenciar: (avaliador: Usuario) => void;
}

export default function AvaliadorList({ onEdit }: AvaliadorListProps) {
    const [avaliadores, setAvaliadores] = useState<Usuario[]>([]);
    const [ctgs, setCTGs] = useState<CTG[]>([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAvaliador, setSelectedAvaliador] = useState<Usuario | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [avaliadorSelecionadoId, setAvaliadorSelecionadoId] = useState<number | null>(null);

    const fetchAvaliadores = async () => {
        try {
            const response = await listarAvaliadores() as Usuario[]
            
            const avaliadoresFormatados: Usuario[] = response.map((usuario) => ({
                ...usuario,
                nomeCompleto: usuario.nomeCompleto || "---",
                cidade: usuario.cidade || "",
                estado: usuario.estado || "",
                CTGId: usuario.CTGId || 0,
                numCarteirinha: usuario.numCarteirinha || "",
                numCredenciamento: usuario.numCredenciamento || 0,
            }));

            setAvaliadores(avaliadoresFormatados);
        } catch (error) {
            toast.error("Erro ao carregar avaliadores");
            console.error(error);
        }
    };

    const fetchCTGs = async () => {
        try {
            const response = await listarCTGs() as CTG[];
            setCTGs(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAvaliadores();
        fetchCTGs();
    }, []);

    const handleConfirmDelete = async () => {
        if (!avaliadorSelecionadoId) return;

        try {
            await deleteUsuario(avaliadorSelecionadoId);
            toast.success("Avaliador excluído com sucesso!");
            fetchAvaliadores();
            setIsDialogOpen(false);
            setAvaliadorSelecionadoId(null);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erro ao excluir avaliador";
            toast.error(msg);
            setIsDialogOpen(false);
            setAvaliadorSelecionadoId(null);
        }
    };

    const getCTGNameById = (idCTG: number | undefined) => {
        if (!idCTG) return "Não informado";
        const ctg = ctgs.find((ctg) => ctg.idCTG === idCTG);
        return ctg?.nomeCTG || "CTG não encontrado";
    };

    return (
        <div className="flex flex-col h-full bg-neutral-background p-6">
            <div className="bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                <table className="w-full">
                <thead>
                    <tr className="text-left bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider">Nome Completo</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider">Filiação (CTG)</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider">Credenciamento</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                    {avaliadores.map((avaliador) => (
                        <tr key={avaliador.idUsuario} className="hover:bg-surface-container transition-colors">
                            <td className="p-4 text-neutral-onSurface font-medium">
                                {avaliador.nomeCompleto}
                            </td>
                            <td className="p-4 text-neutral-onSurface text-sm">
                                {getCTGNameById(avaliador.CTGId)}
                            </td>
                            <td className="p-4">
                                {avaliador.credenciamento === Credenciamento.CREDENCIADO ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary-container text-primary-onContainer">
                                        <BadgeCheck size={14} /> Credenciado {avaliador.numCredenciamento ? `(${avaliador.numCredenciamento})` : ''}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-variant text-neutral-onVariant opacity-70">
                                        Não Credenciado
                                    </span>
                                )}
                            </td>
                            <td className="p-4 flex gap-2 justify-center">
                                <button
                                    title="Visualizar"
                                    className="p-2 rounded-full text-primary hover:bg-primary-fixedDim/30 transition-all"
                                    onClick={() => {
                                        setSelectedAvaliador(avaliador);
                                        setIsViewModalOpen(true);
                                    }}
                                >
                                    <Search size={18} />
                                </button>

                                <button
                                    title="Editar"
                                    className="p-2 rounded-full text-secondary hover:bg-secondary-fixedDim/30 transition-all"
                                    onClick={() => onEdit(avaliador)}
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    title="Excluir"
                                    className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all"
                                    onClick={() => {
                                        setAvaliadorSelecionadoId(avaliador.idUsuario);
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

            {avaliadores.length === 0 && (
                <div className="p-8 text-center text-neutral-onVariant opacity-60">
                    Nenhum avaliador cadastrado.
                </div>
            )}

            <Dialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setAvaliadorSelecionadoId(null);
                }}
                onConfirm={handleConfirmDelete}
                message="Tem certeza que deseja excluir este avaliador?"
            />

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            >
                {selectedAvaliador && (
                    <AvaliadorView
                        avaliador={selectedAvaliador}
                        ctg={ctgs.find((ctg) => ctg.idCTG === selectedAvaliador.CTGId)}
                        onVoltar={() => setIsViewModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    </div>
    );
}