import React, { useEffect, useState } from "react";
import { Comissao } from "../../types/Comissao";
import { Concurso } from "../../types/Concurso";
import { criarComissao, listarConcurso, atualizarComissao } from "../../services/api";
import { toast } from 'react-toastify';
import { Save, XCircle, Users, Trophy, Type } from "lucide-react";

interface ComissaoFormProps {
    onClose: () => void;
    comissaoToEdit?: Comissao;
}

export default function ComissaoForm({ onClose, comissaoToEdit }: ComissaoFormProps) {
    const [formData, setFormData] = useState<Partial<Comissao>>({
        idComissao: 0,
        nomeComissao: '',
        concursoId: 0,
    });

    const [concursos, setConcursos] = useState<Concurso[]>([]);
    const [loading, setLoading] = useState(false);

    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        const fetchConcursos = async () => {
            try {
                const response = await listarConcurso();
                setConcursos(response as Concurso[]);
            } catch (error) {
                console.error("Erro ao buscar concursos", error);
                toast.error("Erro ao carregar lista de concursos.");
            }
        };
        fetchConcursos();
    }, []);

    useEffect(() => {
        if (comissaoToEdit) {
            setFormData({
                idComissao: comissaoToEdit.idComissao,
                nomeComissao: comissaoToEdit.nomeComissao,
                concursoId: Number(comissaoToEdit.concursoId),
            });
        }
    }, [comissaoToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'concursoId' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                usuarios: [] 
            } as Comissao;

            if (formData.idComissao && formData.idComissao > 0) {
                await atualizarComissao(payload);
                toast.success("Comissão atualizada com sucesso!");
            } else {
                await criarComissao(payload);
                toast.success("Comissão cadastrada com sucesso!");
            }

          
            onClose();
        } catch (error) {
            console.error('Erro ao salvar Comissão:', error);
            toast.error('Erro ao salvar Comissão. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">

            {/* Cabeçalho */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <Users className="text-primary" />
                    {comissaoToEdit ? 'Editar Comissão' : 'Nova Comissão'}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Defina o nome da comissão e vincule-a a um concurso.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Nome da Comissão */}
                <div>
                    <label className={labelClass}>
                        <span className="flex items-center gap-2">
                            <Type size={16} className="text-primary" /> Nome da Comissão
                        </span>
                    </label>
                    <input
                        type="text"
                        name="nomeComissao"
                        value={formData.nomeComissao}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: Comissão Artística - Mirim/Juvenil"
                        required
                    />
                </div>

                {/* Seleção de Concurso */}
                <div>
                    <label className={labelClass}>
                        <span className="flex items-center gap-2">
                            <Trophy size={16} className="text-primary" /> Concurso Vinculado
                        </span>
                    </label>
                    <select
                        name="concursoId"
                        value={formData.concursoId || ""}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    >
                        <option value="" disabled>Selecione um Concurso</option>
                        {concursos.map((concurso) => (
                            <option key={concurso.idConcurso} value={concurso.idConcurso}>
                                {concurso.nomeConcurso}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rodapé de Ações */}
                <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-8">
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
                        {loading ? 'Salvando...' : (comissaoToEdit ? 'Salvar Alterações' : 'Cadastrar')}
                    </button>
                </div>
            </form>
        </div>
    );
}