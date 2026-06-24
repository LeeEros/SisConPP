import { useEffect, useState } from "react";
import { listarUsuriosAuxiliares, deleteUsuario, listarCTGs } from "../../services/api";
import { toast } from "react-toastify";
import { Pencil, Trash2, Search, BadgeCheck} from "lucide-react";
import { Usuario, Credenciamento } from "../../types/Usuario";
import { CTG } from "../../types/CTG";
import Dialog from "../Modal/Dialog";
import AuxiliarView from "../View/AuxiliarView";
import Modal from "../Modal/Modal";

interface AuxiliarListProps {
    onEdit: (auxiliar: Usuario) => void;
    onVisualizar: (auxiliar: Usuario) => void;
    onCredenciar: (auxiliar: Usuario) => void;
}

export default function AuxiliarList({ onEdit }: AuxiliarListProps) {
    const [auxiliares, setAuxiliares] = useState<Usuario[]>([]);
    const [ctgs, setCTGs] = useState<CTG[]>([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAuxiliar, setSelectedAuxiliar] = useState<Usuario | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [auxiliarSelecionadoId, setAuxiliarSelecionadoId] = useState<number | null>(null);

    const fetchAuxiliares = async () => {
        try {
            const response = await listarUsuriosAuxiliares() as Usuario[]
            
            const auxiliaresFormatados: Usuario[] = response.map((usuario) => ({
                ...usuario,
                nomeCompleto: usuario.nomeCompleto || "---",
                cidade: usuario.cidade || "",
                estado: usuario.estado || "",
                CTGId: usuario.CTGId || 0,
                numCarteirinha: usuario.numCarteirinha || "",
                numCredenciamento: usuario.numCredenciamento || 0,
            }));

            setAuxiliares(auxiliaresFormatados);
        } catch (error) {
            toast.error("Erro ao carregar auxiliares");
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
        fetchAuxiliares();
        fetchCTGs();
    }, []);

    const handleConfirmDelete = async () => {
        if (!auxiliarSelecionadoId) return;

        try {
            await deleteUsuario(auxiliarSelecionadoId);
            toast.success("Auxiliar excluído com sucesso!");
            fetchAuxiliares();
            setIsDialogOpen(false);
            setAuxiliarSelecionadoId(null);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erro ao excluir auxiliar";
            toast.error(msg);
            setIsDialogOpen(false);
            setAuxiliarSelecionadoId(null);
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
                    {auxiliares.map((auxiliar) => (
                        <tr key={auxiliar.idUsuario} className="hover:bg-surface-container transition-colors">
                            <td className="p-4 text-neutral-onSurface font-medium">
                                {auxiliar.nomeCompleto}
                            </td>
                            <td className="p-4 text-neutral-onSurface text-sm">
                                {getCTGNameById(auxiliar.CTGId)}
                            </td>
                            <td className="p-4">
                                {auxiliar.credenciamento === Credenciamento.CREDENCIADO ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary-container text-primary-onContainer">
                                        <BadgeCheck size={14} /> Credenciado {auxiliar.numCredenciamento ? `(${auxiliar.numCredenciamento})` : ''}
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
                                        setSelectedAuxiliar(auxiliar);
                                        setIsViewModalOpen(true);
                                    }}
                                >
                                    <Search size={18} />
                                </button>

                                <button
                                    title="Editar"
                                    className="p-2 rounded-full text-secondary hover:bg-secondary-fixedDim/30 transition-all"
                                    onClick={() => onEdit(auxiliar)}
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    title="Excluir"
                                    className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all"
                                    onClick={() => {
                                        setAuxiliarSelecionadoId(auxiliar.idUsuario);
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

            {auxiliares.length === 0 && (
                <div className="p-8 text-center text-neutral-onVariant opacity-60">
                    Nenhum auxiliar cadastrado.
                </div>
            )}

            <Dialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setAuxiliarSelecionadoId(null);
                }}
                onConfirm={handleConfirmDelete}
                message="Tem certeza que deseja excluir este auxiliar?"
            />

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            >
                {selectedAuxiliar && (
                    <AuxiliarView
                        auxiliar={selectedAuxiliar}
                        ctg={ctgs.find((ctg) => ctg.idCTG === selectedAuxiliar.CTGId)}
                        onVoltar={() => setIsViewModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    </div>
    );
}