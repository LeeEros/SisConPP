import { useEffect, useState } from "react";
import { listarComissoes, deletarComissao } from "../../services/api";
import { toast } from "react-toastify";
import { Pencil, Trash2, UserPlus, UserMinus, ClipboardCheck, Users, UserCog } from "lucide-react";
import UsuarioComissaoForm from "../Forms/UsuarioComissaoForm";
import DeleteUsuarioForm from "../Forms/RemoverUsuariocomissãoForm";
import Modal from "../Modal/Modal";
import { Comissao } from "../../types/Comissao";
import Dialog from "../Modal/Dialog";
import AtribuicaoAvaliacaoForm from "../Forms/AtribuirAvaliacacaoForm";

interface ComissaoListProps {
    onEdit: (comissao: Comissao) => void;
}

export default function ComissaoList({ onEdit }: ComissaoListProps) {
    const [comissaoAtribuicao, setComissaoAtribuicao] = useState<Comissao | null>(null);
    const [comissaoUsuario, setComissaoUsuario] = useState<Comissao | null>(null);
    const [comissoes, setComissoes] = useState<Comissao[]>([]);
    const [modalDeleteComissao, setModalDeleteComissao] = useState<Comissao | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [comissoesSelecionadaId, setComissoesSelecionadaId] = useState<number | null>(null);

    const fetchComissoes = async () => {
        try {
            const data: Comissao[] = await listarComissoes();
            setComissoes(data);
        } catch (error) {
            toast.error("Erro ao carregar comissões");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchComissoes();
    }, [comissaoAtribuicao, comissaoUsuario, modalDeleteComissao]); 

    const handleConfirmDelete = async (idComissao: number) => {
        try {
            const response = await deletarComissao(idComissao);
            if (response) {
                await fetchComissoes();
                toast.success("Comissão excluída com sucesso!");
                setComissoesSelecionadaId(null);
                setIsDialogOpen(false);
            } else {
                throw new Error("Falha ao excluir comissão");
            }
        } catch (error: unknown) {
            let msg = "Erro ao excluir comissão.";
             const response = await fetch("/api/comissoes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idComissao }),
            });
            if (!response.ok) {
                const erroApi = await response.json();
                toast.error(erroApi.mensagem || "Erro ao excluir comissão.");
            }
            toast.error(msg);
            setIsDialogOpen(false);
            setComissoesSelecionadaId(null);
        }
    }

    return (
        <div className="flex flex-col h-full bg-neutral-background p-6">
            <div className="bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                <table className="w-full">
                <thead>
                    <tr className="text-left bg-surface-variant/30 text-neutral-onVariant border-b border-outline-variant">
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider w-1/5">Nome da Comissão</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider w-1/5">Avaliadores</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider w-1/5">Auxiliar</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider w-1/4">Avaliações Atribuídas</th>
                        <th className="p-4 font-semibold text-xs uppercase tracking-wider text-center w-1/6">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant">
                    {comissoes.map((comissao) => {
                        const avaliadores = comissao.usuarios.filter((u) => u.Usuarios.funcao === "AVALIADOR");
                        const auxiliares = comissao.usuarios.filter((u) => u.Usuarios.funcao === "AUXILIAR");

                        return (
                            <tr key={comissao.idComissao} className="hover:bg-surface-container transition-colors group">
                                <td className="p-4 text-neutral-onSurface font-medium align-top">
                                    {comissao.nomeComissao}
                                </td>
                                
                                <td className="p-4 align-top">
                                    {avaliadores.length > 0 ? (
                                        <ul className="space-y-1">
                                            {avaliadores.map((u) => (
                                                <li key={u.Usuarios.idUsuario} className="text-sm text-neutral-onSurface flex items-center gap-2">
                                                    <Users size={14} className="text-primary opacity-70"/> {u.Usuarios.nomeCompleto}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-sm text-neutral-onVariant opacity-50 italic">Nenhum avaliador</span>
                                    )}
                                </td>

                                <td className="p-4 align-top">
                                    {auxiliares.length > 0 ? (
                                        <ul className="space-y-1">
                                            {auxiliares.map((u) => (
                                                <li key={u.Usuarios.idUsuario} className="text-sm text-neutral-onSurface flex items-center gap-2">
                                                    <UserCog size={14} className="text-secondary opacity-70"/> {u.Usuarios.nomeCompleto}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-sm text-neutral-onVariant opacity-50 italic">Nenhum auxiliar</span>
                                    )}
                                </td>

                                <td className="p-4 align-top">
                                    {comissao.atribuicoes && comissao.atribuicoes.length > 0 ? (
                                        <ul className="space-y-2">
                                            {comissao.atribuicoes.map((atrib) => (
                                                <li key={atrib.idComissaoProvaPratica} className="text-sm bg-surface-containerHigh p-2 rounded-lg border border-outline-variant">
                                                    {atrib.Categoria && (
                                                        <div className="font-semibold text-primary-dark text-xs uppercase">
                                                            {atrib.Categoria.nomeCategoria}
                                                        </div>
                                                    )}
                                                    {atrib.ProvaPratica && (
                                                        <div className="text-neutral-onSurface">
                                                            {atrib.ProvaPratica.nomeProva}
                                                        </div>
                                                    )}
                                                    {atrib.BlocoProva && (
                                                        <div className="text-xs text-neutral-onVariant mt-0.5">
                                                            Bloco: {atrib.BlocoProva.nomeBloco}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-sm text-neutral-onVariant opacity-50 italic">Nenhuma avaliação</span>
                                    )}
                                </td>

                                <td className="p-4 align-top">
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        
                                        <button
                                            title="Atribuir Avaliação"
                                            className="p-2 rounded-full text-tertiary-dark hover:bg-tertiary-fixedDim/30 transition-all"
                                            onClick={() => setComissaoAtribuicao(comissao)}
                                        >
                                            <ClipboardCheck size={18} />
                                        </button>

                                        <button
                                            title="Adicionar Membro"
                                            className="p-2 rounded-full text-primary hover:bg-primary-fixedDim/30 transition-all"
                                            onClick={() => setComissaoUsuario(comissao)}
                                        >
                                            <UserPlus size={18} />
                                        </button>

                                        <button
                                            title="Remover Membro"
                                            className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all"
                                            onClick={() => setModalDeleteComissao(comissao)}
                                        >
                                            <UserMinus size={18} />
                                        </button>

                                        <button 
                                            title="Editar Nome"
                                            className="p-2 rounded-full text-secondary hover:bg-secondary-fixedDim/30 transition-all"
                                            onClick={() => onEdit(comissao)}
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            title="Excluir Comissão"
                                            className="p-2 rounded-full text-error hover:bg-error-container/30 transition-all"
                                            onClick={() => {
                                                setComissoesSelecionadaId(comissao.idComissao);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {comissoes.length === 0 && (
                <div className="p-8 text-center text-neutral-onVariant opacity-60">
                    Nenhuma comissão cadastrada.
                </div>
            )}

            {/* Modais Internos */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setComissoesSelecionadaId(null);
                }}
                onConfirm={() => comissoesSelecionadaId && handleConfirmDelete(comissoesSelecionadaId)}
                message="Tem certeza que deseja excluir esta comissão? Todas as atribuições serão perdidas."
            />

            {comissaoAtribuicao && (
                <Modal isOpen={true} onClose={() => setComissaoAtribuicao(null)}>
                    <AtribuicaoAvaliacaoForm
                        comissao={comissaoAtribuicao}
                        onClose={() => setComissaoAtribuicao(null)}
                        onSaved={fetchComissoes}
                    />
                </Modal>
            )}

            {comissaoUsuario && (
                <Modal isOpen={true} onClose={() => setComissaoUsuario(null)}>
                    <UsuarioComissaoForm
                        comissao={comissaoUsuario}
                        onClose={() => setComissaoUsuario(null)}
                        onSaved={fetchComissoes}
                    />
                </Modal>
            )}

            {modalDeleteComissao && (
                <Modal isOpen={true} onClose={() => setModalDeleteComissao(null)}>
                    <DeleteUsuarioForm
                        comissao={modalDeleteComissao}
                        onClose={() => setModalDeleteComissao(null)}
                        onDeleted={fetchComissoes}
                    />
                </Modal>
            )}
        </div >
    </div>
    );
};