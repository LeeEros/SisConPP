import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Comissao } from '../../types/Comissao';
import { listarUsuriosAvaliadores, listarUsuriosAuxiliares, adicionarAuxiliarComissao, adicionarAvaliadorComissao} from '../../services/api';
import { Save, XCircle, UserCheck, UserCog, UserPlus } from 'lucide-react';

interface UsuarioComissaoFormProps {
    onClose: () => void;
    comissao: Comissao;
    onSaved?: () => void;
}

export default function UsuarioComissaoForm({ comissao, onClose, onSaved }: UsuarioComissaoFormProps) {

    const [formData, setFormData] = useState({
        usuarioId: 0,
        comissaoId: comissao.idComissao
    });

    const [tipoUsuario, setTipoUsuario] = useState<"AVALIADOR" | "AUXILIAR">("AVALIADOR");
    const [usuarios, setUsuarios] = useState<{ idUsuario: number; nomeCompleto: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (tipoUsuario === "AVALIADOR") {
                    const listaAvaliadores = await listarUsuriosAvaliadores();
                    setUsuarios(listaAvaliadores);
                } else {
                    const listaAuxiliares = await listarUsuriosAuxiliares();
                    setUsuarios(listaAuxiliares);
                }
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar lista de usuários.");
            }
        };
        fetchData();
    }, [tipoUsuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.usuarioId === 0) {
            toast.warning("Selecione um usuário.");
            return;
        }
        
        setLoading(true);
        try{
            if(tipoUsuario === "AVALIADOR"){
                await adicionarAvaliadorComissao(formData.usuarioId, formData.comissaoId);
                toast.success("Avaliador adicionado com sucesso!");
            } else{
                await adicionarAuxiliarComissao(formData.usuarioId, formData.comissaoId);
                toast.success("Auxiliar adicionado com sucesso!");
            }
            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao adicionar usuário à comissão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <UserPlus className="text-primary" /> Adicionar Membro
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Vincule um avaliador ou auxiliar à comissão <strong>{comissao.nomeComissao}</strong>.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className={labelClass}>Tipo de Membro</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setTipoUsuario("AVALIADOR")}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                tipoUsuario === "AVALIADOR"
                                    ? "bg-primary-container text-primary-onContainer border-primary shadow-sm"
                                    : "bg-surface-containerHigh text-neutral-onSurface border-transparent hover:bg-surface-variant"
                            }`}
                        >
                            <UserCheck size={24} />
                            <span className="font-bold text-sm">Avaliador</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTipoUsuario("AUXILIAR")}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                tipoUsuario === "AUXILIAR"
                                    ? "bg-secondary-container text-secondary-onContainer border-secondary shadow-sm"
                                    : "bg-surface-containerHigh text-neutral-onSurface border-transparent hover:bg-surface-variant"
                            }`}
                        >
                            <UserCog size={24} />
                            <span className="font-bold text-sm">Auxiliar</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className={labelClass}>
                        Selecione o {tipoUsuario === "AVALIADOR" ? "Avaliador" : "Auxiliar"}
                    </label>
                    <select
                        className={inputClass}
                        value={formData.usuarioId}
                        onChange={(e) => setFormData({ ...formData, usuarioId: Number(e.target.value) })}
                        required
                    >
                        <option value={0} disabled>-- Selecione --</option>
                        {usuarios.map((u) => (
                            <option key={u.idUsuario} value={u.idUsuario}>
                                {u.nomeCompleto}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-neutral-onSurface hover:bg-surface-variant transition font-medium"
                    >
                        <XCircle size={18} />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-dark text-secondary-on rounded-xl shadow-md transition font-bold disabled:opacity-70"
                    >
                        <Save size={18} />
                        {loading ? "Salvando..." : "Adicionar Membro"}
                    </button>
                </div>
            </form>
        </div>
    );
}