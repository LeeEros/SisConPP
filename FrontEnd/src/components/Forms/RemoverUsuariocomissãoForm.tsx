import { toast } from "react-toastify";
import { deletarUsuarioComissao } from "../../services/api";
import { Comissao } from "../../types/Comissao";
import { Trash2, UserMinus, User, XCircle, Shield, UserCog } from "lucide-react";

interface Props {
    comissao: Comissao;
    onClose: () => void;
    onDeleted: () => void;
}

export default function DeleteUsuarioForm({ comissao, onClose, onDeleted }: Props) {
    
    const handleDelete = async (usuarioId: number) => {
        if (!window.confirm("Tem certeza que deseja remover este usuário da comissão?")) return;

        try {
            await deletarUsuarioComissao(usuarioId, comissao.idComissao);
            toast.success("Usuário removido com sucesso!");
            onDeleted();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao remover usuário");
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-error flex items-center gap-2">
                    <UserMinus className="text-error" /> Remover Membros
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Gerencie os participantes da comissão <strong>{comissao.nomeComissao}</strong>.
                </p>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {comissao.usuarios.length > 0 ? (
                    <ul className="space-y-3">
                        {comissao.usuarios.map((u) => {
                            const isAvaliador = u.Usuarios.funcao === "AVALIADOR";
                            
                            return (
                                <li
                                    key={u.idComissaoUsuario}
                                    className="flex justify-between items-center p-3 bg-surface-containerHigh border border-outline rounded-xl hover:bg-surface-container transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar / Ícone */}
                                        <div className={`p-2.5 rounded-full ${
                                            isAvaliador 
                                                ? "bg-primary-container text-primary-onContainer" 
                                                : "bg-secondary-container text-secondary-onContainer"
                                        }`}>
                                            {isAvaliador ? <Shield size={20} /> : <UserCog size={20} />}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold text-neutral-onSurface text-sm">
                                                {u.Usuarios.nomeCompleto}
                                            </span>
                                            <span className="text-xs text-neutral-onSurface opacity-60 font-medium uppercase tracking-wide">
                                                {isAvaliador ? "Avaliador" : "Auxiliar"}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(u.Usuarios.idUsuario)}
                                        className="p-2 rounded-lg text-error opacity-70 hover:opacity-100 hover:bg-error-container/20 transition-all"
                                        title="Remover da comissão"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-8 text-center border-2 border-dashed border-outline-variant rounded-xl">
                        <User className="mx-auto h-10 w-10 text-neutral-onSurface opacity-20 mb-2" />
                        <p className="text-neutral-onSurface opacity-50">
                            Nenhum usuário vinculado a esta comissão.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-6 border-t border-outline-variant mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition font-bold"
                >
                    <XCircle size={18} />
                    Fechar
                </button>
            </div>
        </div>
    );
}