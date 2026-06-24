import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listarCategorias, criarProvaTeorica} from "../../../services/api";
import { Categoria } from "../../../types/Categoria";
import { ProvaTeoricaF } from "../../../types/ProvaTeorica";
import { Save, XCircle, BookOpen, CheckSquare } from "lucide-react";

interface ProvaTeoricaFormProps {
    onClose: () => void;
    provaToEdit?: ProvaTeoricaF;
}

export default function ProvaTeoricaForm({ onClose, provaToEdit }: ProvaTeoricaFormProps) {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nomeProva, setNomeProva] = useState("");
    const [notaMaxima, setNotaMaxima] = useState<number | "">("");
    const [numQuestoes, setNumQuestoes] = useState<number | "">("");
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const isEditMode = !!provaToEdit;

    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await listarCategorias();
                setCategorias(response as Categoria[]);
            } catch {
                toast.error("Erro ao carregar categorias");
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (provaToEdit) {
            setNomeProva(provaToEdit.nomeProva);
            setNotaMaxima(provaToEdit.notaMaxima);
            setNumQuestoes(provaToEdit.numQuestao);
            setCategoriasSelecionadas(provaToEdit.categorias ?? []);
        }
    }, [provaToEdit]);

    const toggleCategoria = (id: number) => {
        setCategoriasSelecionadas((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nomeProva.trim()) {
            toast.warning("Informe o nome da prova");
            return;
        }
        if (!notaMaxima || notaMaxima <= 0) {
            toast.warning("Informe a nota máxima");
            return;
        }
        if (!numQuestoes || numQuestoes <= 0) {
            toast.warning("Informe o número de questões");
            return;
        }
        if (categoriasSelecionadas.length === 0) {
            toast.warning("Selecione ao menos uma categoria");
            return;
        }

        const payload = {
            nomeProva: nomeProva.trim(),
            notaMaxima: Number(notaMaxima),
            categorias: categoriasSelecionadas,
            numQuestao: Number(numQuestoes)
        };

        try {
            setLoading(true);
            if (isEditMode) {
                await criarProvaTeorica(payload); 
                toast.success("Prova teórica atualizada com sucesso");
            } else {
                await criarProvaTeorica(payload);
                toast.success("Prova teórica criada com sucesso");
            }
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar prova teórica");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <BookOpen className="text-primary" /> 
                    {isEditMode ? "Editar Prova Teórica" : "Nova Prova Teórica"}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Configure os parâmetros gerais da avaliação escrita.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className={labelClass}>Nome da Prova</label>
                    <input
                        type="text"
                        value={nomeProva}
                        onChange={(e) => setNomeProva(e.target.value)}
                        className={inputClass}
                        placeholder="Ex: Prova de História e Geografia"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Nota Máxima</label>
                        <input
                            type="number"
                            min={1}
                            value={notaMaxima}
                            onChange={(e) => setNotaMaxima(e.target.value ? Number(e.target.value) : "")}
                            className={inputClass}
                            placeholder="Ex: 100"
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Nº de Questões</label>
                        <input
                            type="number"
                            min={1}
                            value={numQuestoes}
                            onChange={(e) => setNumQuestoes(e.target.value ? Number(e.target.value) : "")}
                            className={inputClass}
                            placeholder="Ex: 50"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Categorias Aplicáveis</label>
                    <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-containerLowest max-h-56 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {categorias.map((cat) => {
                                    const isSelected = categoriasSelecionadas.includes(cat.idCategoria);
                                    return (
                                        <tr 
                                            key={cat.idCategoria} 
                                            onClick={() => toggleCategoria(cat.idCategoria)}
                                            className={`
                                                cursor-pointer border-b border-outline-variant last:border-0 transition-colors
                                                ${isSelected ? 'bg-primary-container/20' : 'hover:bg-surface-container'}
                                            `}
                                        >
                                            <td className="p-3 pl-4 text-sm font-medium text-neutral-onSurface">
                                                {cat.nomeCategoria}
                                            </td>
                                            <td className="p-3 pr-4 text-right w-16">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    readOnly
                                                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-neutral-onSurface opacity-60 mt-2 flex items-center gap-1">
                        <CheckSquare size={12}/> Selecione para quem esta prova será aplicada.
                    </p>
                </div>

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
                        {loading ? "Salvando..." : (isEditMode ? "Atualizar" : "Criar Prova")}
                    </button>
                </div>
            </form>
        </div>
    );
}