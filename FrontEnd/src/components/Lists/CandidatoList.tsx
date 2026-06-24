import { useEffect, useState } from "react";
import { Candidato } from "../../types/Candidato";
import { CTG } from "../../types/CTG";
import { Categoria } from "../../types/Categoria";
import { toast } from "react-toastify";
import { Pencil, Trash2, Search, FilePlus2 } from "lucide-react";
import Dialog from "../Modal/Dialog";
import { listarCTGs, listarCategorias, listarCandidatos, deletarCandidato, buscarCandidatoPorId } from "../../services/api";
import Modal from "../Modal/Modal";
import CandidatoView from "../View/CandidadoView";
import FichaCandidatoForm from "../Forms/FichaCandidatoForm";

interface CandidatoListProps {
    onEdit: (candidato: Candidato) => void;
    onVisualizar: (candidato: Candidato) => void;
    onCredenciar: (candidato: Candidato) => void;
}

interface CandidatoCompleto extends Candidato {
    ctg?: CTG;
    categoria?: Categoria;
}

export default function CandidatoList({ onEdit }: CandidatoListProps) {
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [ctgs, setCTGs] = useState<CTG[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [candidatoSelecionadoId, setCandidatoSelecionadoId] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCandidato, setSelectedCandidato] = useState<CandidatoCompleto | null>(null);
    const [isFichaModalOpen, setIsFichaModalOpen] = useState(false);
    const [candidatoParaFicha, setCandidatoParaFicha] = useState<Candidato | null>(null);


    const fetchCandidatos = async () => {
        try {
            const response = await listarCandidatos() as Candidato[];
            const candidatosFormatados = response.map((candidato) => ({
                ...candidato,
                nomeCompleto: candidato.nomeCompleto || '',
                cidade: candidato.cidade || '',
                estado: candidato.estado || '',
                CTGId: candidato.CTGId || 0,
                numCarteirinha: candidato.numCarteirinha || '',
                CPF: candidato.CPF || '',
                RG: candidato.RG || '',
                endereco: candidato.endereco || '',
                numEndereco: candidato.numEndereco || 0,
                bairro: candidato.bairro || '',
                escolaridade: candidato.escolaridade || '',
                filiacaoPai: candidato.filiacaoPai || '',
                filiacaoMae: candidato.filiacaoMae || '',
                categoriaId: candidato.categoriaId || 0
            }));
            setCandidatos(candidatosFormatados);
        } catch (error) {
            toast.error("Erros ao carregar candidatos");
            console.error(error);
        }
    };

    const fetchCTGs = async () => {
        try {
            const response = await listarCTGs() as CTG[];
            setCTGs(response);
        } catch (error) {
            toast.error("Erro ao carregar CTGs");
            console.error(error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await listarCategorias();
            setCategorias(response as Categoria[]);
        } catch (error) {
            console.error("Erro ao buscar Categorias:", error);
        }
    };

    useEffect(() => {
        fetchCandidatos();
        fetchCTGs();
        fetchCategorias();
    }, []);

    const handleVisualizarCandidato = async (id: number) => {
        try {
            const candidatoCompleto = await buscarCandidatoPorId(id);
            setSelectedCandidato(candidatoCompleto as CandidatoCompleto);
            console.log("Candidato selecionado para visualização:", candidatoCompleto);
        } catch (error) {
            console.error("Erro ao buscar detalhes do candidato:", error);
            toast.error("Erro ao buscar detalhes do candidato.");
        }
    };

    const handleConfirmDelete = async (id: number) => {
        try {
            const response = await deletarCandidato(id);
            if (response !== null && response !== undefined) {
                await fetchCandidatos();
                toast.success("Candidato excluído com sucesso!");
                setIsDialogOpen(false);
                setCandidatoSelecionadoId(null);
            } else {
                throw new Error("Falha ao excluir candidato");
            }
        } catch (error) {
            console.error("Erro ao excluir candidato:", error);
            toast.error("Erro ao excluir candidato. Tente novamente.");
        }
    };

    const getCTGNameById = (idCTG: number | undefined) => {
        if (!idCTG) return "CTG não informado";
        const ctg = ctgs.find((ctg) => ctg.idCTG === idCTG);
        return ctg?.nomeCTG || "CTG não encontrado";
    };

    const getCategoriaNameById = (idCategoria: number | undefined) => {
        if (!idCategoria) return "Categoria não informada";
        const categoria = categorias.find((categoria) => categoria.idCategoria === idCategoria);
        return categoria?.nomeCategoria || "Categoria não encontrada";
    };

    const getBadgeStyle = (nomeCategoria: string) => {
        const nome = nomeCategoria.toLowerCase();
        if (nome.includes('prenda')) {
            return "bg-secondary-container text-secondary-onContainer";
        }
        if (nome.includes('peão') || nome.includes('peao')) {
            return "bg-primary-container text-primary-onContainer";
        }
        return "bg-surface-variant text-surface-onVariant";
    };

    return (
        <div className="flex flex-col h-full bg-neutral-background p-6">
            <div className="bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Nome Completo</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">CTG</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider">Categoria</th>
                            <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {candidatos.map((candidato) => {
                            const nomeCategoria = getCategoriaNameById(candidato.categoriaId);

                            return (
                                <tr key={candidato.idCandidato} className="hover:bg-surface-container transition-colors">
                                    <td className="p-4 text-neutral-onSurface font-medium">
                                        {candidato.nomeCompleto || "---"}
                                    </td>
                                    <td className="p-4 text-neutral-onSurface text-sm">
                                        {getCTGNameById(candidato.CTGId)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(nomeCategoria)}`}>
                                            {nomeCategoria}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-center">
                                        <button title="Ficha" className="p-2 rounded-full text-tertiary-dark hover:bg-tertiary-fixedDim/30 transition-all" onClick={() => { setCandidatoParaFicha(candidato); setIsFichaModalOpen(true); }}> <FilePlus2 size={18} /> </button>
                                        <button title="Ver" className="p-2 rounded-full text-primary hover:bg-primary-fixedDim/30 transition-all" onClick={() => { handleVisualizarCandidato(candidato.idCandidato); setIsViewModalOpen(true); }}> <Search size={18} /> </button>
                                        <button title="Editar" className="p-2 rounded-full text-secondary hover:bg-secondary-fixedDim/30 transition-all" onClick={() => onEdit(candidato)}> <Pencil size={18} /> </button>
                                        <button title="Excluir" className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all" onClick={() => { setCandidatoSelecionadoId(candidato.idCandidato); setIsDialogOpen(true); }}> <Trash2 size={18} /> </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {candidatos.length === 0 && (
                    <div className="p-8 text-center text-neutral-onVariant">
                        Nenhum candidato encontrado.
                    </div>
                )}
            </div>

            <Dialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setCandidatoSelecionadoId(null);
                }}
                onConfirm={() => {
                    if (candidatoSelecionadoId !== null) {
                        handleConfirmDelete(candidatoSelecionadoId);
                    }
                }}
                message="Tem certeza que deseja excluir este candidato?"
            />

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            >
                {selectedCandidato && (
                    <CandidatoView
                        candidato={selectedCandidato}
                        onVoltar={() => setIsViewModalOpen(false)}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isFichaModalOpen}
                onClose={() => {
                    setIsFichaModalOpen(false);
                    setCandidatoParaFicha(null);
                }}
            >
                {candidatoParaFicha && (
                    <FichaCandidatoForm
                        candidatoToEdit={{
                            candidatoId: candidatoParaFicha.idCandidato,
                            concursoId: 0
                        }}
                        onClose={() => {
                            setIsFichaModalOpen(false);
                            setCandidatoParaFicha(null);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}
