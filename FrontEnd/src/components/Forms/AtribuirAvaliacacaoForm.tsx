import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Comissao, ComissaoProvaPraticaForm } from "../../types/Comissao";
import { listarCategorias, buscarProvasPraticas, listarBlocosProva, atribuirAvaliacaoComissao } from "../../services/api";
import { Categoria } from "../../types/Categoria";
import { ProvaPratica, BlocoProva } from "../../types/ProvaPratica";
import { Save, XCircle, ClipboardCheck, Layers, FileText, LayoutGrid } from "lucide-react";

interface Props {
    comissao: Comissao;
    onClose: () => void;
    onSaved?: () => void;
}

type TipoAtribuicao = "CATEGORIA" | "PROVA" | "BLOCO";

export default function AtribuicaoAvaliacaoForm({ comissao, onClose, onSaved }: Props) {
    const [tipo, setTipo] = useState<TipoAtribuicao>("CATEGORIA");

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [provas, setProvas] = useState<ProvaPratica[]>([]);
    const [blocos, setBlocos] = useState<BlocoProva[]>([]);

    const [categoriaId, setCategoriaId] = useState<number | undefined>();
    const [provaPraticaId, setProvaPraticaId] = useState<number | undefined>();
    const [blocoProvaId, setBlocoProvaId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    // Estilos Padronizados
    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriasResp, provasResp, blocosResp] = await Promise.all([
                    listarCategorias(),
                    buscarProvasPraticas(),
                    listarBlocosProva(),
                ]);
                setCategorias(categoriasResp as Categoria[]);
                setProvas(provasResp as ProvaPratica[]);
                setBlocos(blocosResp as BlocoProva[]);
            } catch {
                toast.error("Erro ao carregar dados para atribuição");
            }
        }
        fetchData();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const payload: ComissaoProvaPraticaForm = {
            comissaoId: comissao.idComissao,
            categoriaId: tipo === "CATEGORIA" ? categoriaId : undefined,
            provaPraticaId: tipo === "PROVA" ? provaPraticaId : undefined,
            blocoProvaId: tipo === "BLOCO" ? blocoProvaId : undefined,
        };

        try {
            await atribuirAvaliacaoComissao(payload);
            toast.success("Avaliação atribuída com sucesso!");
            onSaved?.();
            onClose();
        } catch {
            toast.error("Erro ao atribuir avaliação");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full text-neutral-onBackground">
            
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <ClipboardCheck className="text-primary" /> Atribuir Avaliação
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Defina o escopo de avaliação para a comissão <strong>{comissao.nomeComissao}</strong>.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Seleção do Tipo (Cards) */}
                <div>
                    <label className={labelClass}>O que esta comissão irá avaliar?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: "CATEGORIA", label: "Categoria", icon: Layers },
                            { id: "PROVA", label: "Prova Prática", icon: FileText },
                            { id: "BLOCO", label: "Bloco", icon: LayoutGrid },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setTipo(item.id as TipoAtribuicao)}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                    tipo === item.id
                                        ? "bg-tertiary-container text-tertiary-onContainer border-tertiary shadow-sm ring-1 ring-tertiary"
                                        : "bg-surface-containerHigh text-neutral-onSurface border-transparent hover:bg-surface-variant opacity-70 hover:opacity-100"
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="font-bold text-xs">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campos Condicionais */}
                <div className="animate-fadeIn">
                    {tipo === "CATEGORIA" && (
                        <div>
                            <label className={labelClass}>Selecione a Categoria</label>
                            <select
                                className={inputClass}
                                value={categoriaId ?? ""}
                                onChange={(e) => setCategoriaId(Number(e.target.value))}
                                required
                            >
                                <option value="">-- Selecione --</option>
                                {categorias.map((c) => (
                                    <option key={c.idCategoria} value={c.idCategoria}>
                                        {c.nomeCategoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {tipo === "PROVA" && (
                        <div>
                            <label className={labelClass}>Selecione a Prova Prática</label>
                            <select
                                className={inputClass}
                                value={provaPraticaId ?? ""}
                                onChange={(e) => setProvaPraticaId(Number(e.target.value))}
                                required
                            >
                                <option value="">-- Selecione --</option>
                                {provas.map((p) => (
                                    <option key={p.idProvaPratica} value={p.idProvaPratica}>
                                        {p.nomeProva}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {tipo === "BLOCO" && (
                        <div>
                            <label className={labelClass}>Selecione o Bloco</label>
                            <select
                                className={inputClass}
                                value={blocoProvaId ?? ""}
                                onChange={(e) => setBlocoProvaId(Number(e.target.value))}
                                required
                            >
                                <option value="">-- Selecione --</option>
                                {blocos.map((b) => {
                                    const nomeCategorias = (b as any).ProvaPratica?.categorias
                                        ?.map((c: any) => c.nomeCategoria)
                                        .join(" / ");
                                    return (
                                        <option key={b.idBloco} value={b.idBloco}>
                                            {b.nomeBloco} {nomeCategorias ? `- ${nomeCategorias}` : ""}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}
                </div>

                {/* Rodapé */}
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
                        {loading ? "Atribuindo..." : "Confirmar Atribuição"}
                    </button>
                </div>
            </form>
        </div>
    );
}