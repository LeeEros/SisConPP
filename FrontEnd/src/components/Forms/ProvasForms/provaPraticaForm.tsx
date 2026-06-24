import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listarCategorias, criarProvaPratica, atualizarProvaPratica } from "../../../services/api";
import { Categoria } from "../../../types/Categoria";
import { ProvaPratica } from "../../../types/ProvaPratica";
import { Save, XCircle, FileText, CheckSquare } from "lucide-react";

interface ProvaPraticaFormProps {
    onClose: () => void;
    provaToEdit?: ProvaPratica;
}

export default function ProvaPraticaForm({ onClose, provaToEdit }: ProvaPraticaFormProps) {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nomeProva, setNomeProva] = useState("");
    const [notaMaxima, setNotaMaxima] = useState<number | "">("");
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const isEditMode = !!provaToEdit;

    // Estilos Padronizados
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
            toast.warning("Informe uma nota máxima válida");
            return;
        }
        if (categoriasSelecionadas.length === 0) {
            toast.warning("Selecione ao menos uma categoria");
            return;
        }

        const payload = {
            idProvaPratica: provaToEdit?.idProvaPratica ?? 0,
            nomeProva: nomeProva.trim(),
            notaMaxima: Number(notaMaxima),
            categorias: categoriasSelecionadas,
            blocosProvas: [],
        };

        try {
            setLoading(true);
            if (isEditMode) {
                await atualizarProvaPratica(payload);
                toast.success("Prova atualizada com sucesso");
            } else {
                await criarProvaPratica(payload);
                toast.success("Prova criada com sucesso");
            }
            onClose();
        } catch {
            toast.error("Erro ao salvar prova prática");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            
            {/* Cabeçalho */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <FileText className="text-primary" /> 
                    {isEditMode ? "Editar Prova Prática" : "Nova Prova Prática"}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Defina o nome, nota máxima e as categorias aplicáveis.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campos Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Nome da Prova</label>
                        <input
                            type="text"
                            value={nomeProva}
                            onChange={(e) => setNomeProva(e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Prova de Galpão"
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Nota Máxima</label>
                        <input
                            type="number"
                            min={1}
                            value={notaMaxima}
                            onChange={(e) => setNotaMaxima(e.target.value ? Number(e.target.value) : "")}
                            className={inputClass}
                            placeholder="Ex: 10"
                            required
                        />
                    </div>
                </div>

                {/* Seleção de Categorias */}
                <div>
                    <label className={labelClass}>Categorias Aplicáveis</label>
                    <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-containerLowest max-h-60 overflow-y-auto custom-scrollbar">
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
                        <CheckSquare size={12}/> Selecione uma ou mais categorias.
                    </p>
                </div>

                {/* Rodapé de Ações */}
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