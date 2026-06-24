import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Quesitos, BlocoProva } from "../../../types/ProvaPratica";
import { criarQuesito, listarBlocosProva } from "../../../services/api";
import { Save, XCircle, ListChecks } from "lucide-react";

interface QuesitoFormProps {
    onClose: () => void;
    quesitoToEdit?: Quesitos;
    blocoId?: number;
    provaTeoricaId: number;
}

interface QuesitoFormState {
    idQuesito?: number;
    nomeQuesito: string;
    notaMaximaQuesito: number;
    opcional: boolean;
    blocoProvaIdBloco?: number;
    provaTeoricaIdprovaTeorica?: number;
}

export default function QuesitoForm({ onClose, quesitoToEdit, blocoId, provaTeoricaId }: QuesitoFormProps) {
    const isProvaTeorica = !!provaTeoricaId;
    const [listaBlocos, setListaBlocos] = useState<BlocoProva[]>([]);
    const [formData, setFormData] = useState<QuesitoFormState>({
        nomeQuesito: "",
        notaMaximaQuesito: 0,
        opcional: false,
        blocoProvaIdBloco: blocoId,
        provaTeoricaIdprovaTeorica: provaTeoricaId,
    });
    const [loading, setLoading] = useState(false);

    // Estilos Padronizados
    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        if (isProvaTeorica) return;
        const carregarBlocos = async () => {
            try {
                const response = await listarBlocosProva();
                setListaBlocos(response as BlocoProva[]);
            } catch {
                toast.error("Erro ao carregar blocos de prova");
            }
        };
        carregarBlocos();
    }, [isProvaTeorica]);

    useEffect(() => {
        if (quesitoToEdit) {
            setFormData({
                idQuesito: quesitoToEdit.idQuesito,
                nomeQuesito: quesitoToEdit.nomeQuesito,
                notaMaximaQuesito: quesitoToEdit.notaMaximaQuesito,
                opcional: quesitoToEdit.opcional,
                blocoProvaIdBloco: quesitoToEdit.blocoProvaIdBloco,
                provaTeoricaIdprovaTeorica: quesitoToEdit.provaTeoricaIdprovaTeorica,
            });
        }
    }, [quesitoToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
            return;
        }
        if (name === "notaMaximaQuesito" || name === "blocoProvaIdBloco") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nomeQuesito.trim() || formData.notaMaximaQuesito <= 0) {
            toast.warning("Preencha nome e nota máxima válida");
            return;
        }

        const payload: Quesitos = {
            idQuesito: formData.idQuesito ?? 0,
            nomeQuesito: formData.nomeQuesito,
            notaMaximaQuesito: formData.notaMaximaQuesito,
            opcional: formData.opcional,
            blocoProvaIdBloco: isProvaTeorica ? undefined : formData.blocoProvaIdBloco,
            provaTeoricaIdprovaTeorica: isProvaTeorica ? provaTeoricaId : undefined,
            subQuesitos: quesitoToEdit?.subQuesitos || [],
        };

        try {
            setLoading(true);
            await criarQuesito(payload);
            toast.success(quesitoToEdit ? "Quesito atualizado!" : "Quesito criado!");
            onClose();
        } catch {
            toast.error("Erro ao salvar quesito");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <ListChecks className="text-primary" /> 
                    {quesitoToEdit ? "Editar Quesito" : "Novo Quesito"}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Quesitos são os itens avaliados dentro de um bloco.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                    <label className={labelClass}>Nome do Quesito</label>
                    <input
                        type="text"
                        name="nomeQuesito"
                        value={formData.nomeQuesito}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: Correção da Indumentária"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Nota Máxima</label>
                        <input
                            type="number"
                            name="notaMaximaQuesito"
                            value={formData.notaMaximaQuesito}
                            onChange={handleChange}
                            min={0}
                            step="0.1"
                            className={inputClass}
                            required
                        />
                    </div>
                    
                    {!isProvaTeorica && (
                        <div>
                            <label className={labelClass}>Bloco de Prova</label>
                            <select
                                name="blocoProvaIdBloco"
                                value={formData.blocoProvaIdBloco ?? ""}
                                onChange={handleChange}
                                className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                                disabled
                                required
                            >
                                <option value="" disabled>Selecione</option>
                                {listaBlocos.map((b) => (
                                    <option key={b.idBloco} value={b.idBloco}>
                                        {b.nomeBloco}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Checkbox Estilizado */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-outline bg-surface-containerLowest hover:bg-surface-container transition-colors cursor-pointer" onClick={() => setFormData(prev => ({...prev, opcional: !prev.opcional}))}>
                    <input
                        type="checkbox"
                        name="opcional"
                        checked={formData.opcional}
                        onChange={handleChange}
                        className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <div>
                        <span className="block text-sm font-semibold text-neutral-onSurface">Este quesito é opcional?</span>
                        <span className="block text-xs text-neutral-onSurface opacity-60">Se marcado, a nota pode ser nula.</span>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-neutral-onSurface hover:bg-surface-variant transition font-medium"
                    >
                        <XCircle size={18} /> Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-dark text-secondary-on rounded-xl shadow-md transition font-bold disabled:opacity-70"
                    >
                        <Save size={18} />
                        {loading ? "Salvando..." : "Salvar Quesito"}
                    </button>
                </div>
            </form>
        </div>
    );
}