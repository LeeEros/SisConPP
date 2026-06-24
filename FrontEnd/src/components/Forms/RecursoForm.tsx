import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { solicitarRecurso, listarCandidatos, listarUsuriosAvaliadores } from "../../services/api";
import { Save, XCircle, FileWarning, Upload } from "lucide-react";
import { Candidato } from "../../types/Candidato";
import { UsuarioAvaliador } from "../../types/Usuario";

interface RecursoFormProps {
    onClose: () => void;
}

export default function RecursoForm({ onClose }: RecursoFormProps) {
    const [loading, setLoading] = useState(false);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [avaliadores, setAvaliadores] = useState<UsuarioAvaliador[]>([]);

    const [formData, setFormData] = useState({
        nomeRecurso: "",
        justificativa: "",
        candidatoId: "",
        avaliadorId: "",
        quesitoRecurso: "",
        arquivo: null as File | null
    });

    // Estilos Padronizados (NÃO ALTERADOS)
    const inputClass =
        "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        listarCandidatos().then(res => setCandidatos(res as Candidato[]));
        listarUsuriosAvaliadores().then(res => setAvaliadores(res as UsuarioAvaliador[]));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, arquivo: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.nomeRecurso ||
            !formData.justificativa ||
            !formData.candidatoId ||
            !formData.avaliadorId ||
            !formData.quesitoRecurso
        ) {
            toast.warning("Preencha todos os campos obrigatórios.");
            return;
        }

        if (!formData.arquivo) {
            toast.warning("É necessário anexar um arquivo.");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            data.append("nomeRecurso", formData.nomeRecurso);
            data.append("justificativa", formData.justificativa);
            data.append("candidato", formData.candidatoId);
            data.append("avaliador", formData.avaliadorId);
            data.append("quesitoRecurso", formData.quesitoRecurso);
            data.append("arquivo", formData.arquivo);

            await solicitarRecurso(data);

            toast.success("Recurso solicitado com sucesso!");
            onClose();
        } catch (error: any) {
            console.error("Erro ao solicitar recurso:", error);
            toast.error(
                error?.response?.data?.mensagem || "Erro ao solicitar recurso."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            {/* Cabeçalho */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <FileWarning className="text-primary" />
                    Novo Recurso
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Preencha os dados para formalizar a solicitação de revisão.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Título do Recurso */}
                <div>
                    <label className={labelClass}>Título do Recurso</label>
                    <input
                        type="text"
                        name="nomeRecurso"
                        value={formData.nomeRecurso}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: Revisão da nota do quesito Indumentária"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Candidato */}
                    <div>
                        <label className={labelClass}>Candidato</label>
                        <select
                            name="candidatoId"
                            value={formData.candidatoId}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        >
                            <option value="">Selecione...</option>
                            {candidatos.map(c => (
                                <option key={c.idCandidato} value={c.idCandidato}>
                                    {c.nomeCompleto}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Avaliador */}
                    <div>
                        <label className={labelClass}>Avaliador</label>
                        <select
                            name="avaliadorId"
                            value={formData.avaliadorId}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        >
                            <option value="">Selecione...</option>
                            {avaliadores.map(a => (
                                <option key={a.idUsuario} value={a.idUsuario}>
                                    {a.nomeCompleto}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Quesito */}
                <div>
                    <label className={labelClass}>Quesito</label>
                    <input
                        type="number"
                        name="quesitoRecurso"
                        value={formData.quesitoRecurso}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: 5"
                        required
                    />
                </div>

                {/* Justificativa */}
                <div>
                    <label className={labelClass}>Justificativa Detalhada</label>
                    <textarea
                        name="justificativa"
                        value={formData.justificativa}
                        onChange={handleChange}
                        className={`${inputClass} min-h-[120px] resize-none`}
                        placeholder="Descreva o motivo do recurso..."
                        required
                    />
                </div>

                {/* Upload */}
                <div>
                    <label className={labelClass}>Anexar Arquivos(PDF/Imagem)</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                            className={`w-full p-3 rounded-xl border border-dashed border-outline flex items-center justify-center gap-2 text-sm ${
                                formData.arquivo
                                    ? "bg-primary-container/20 text-primary-dark border-primary"
                                    : "bg-surface-containerHigh text-neutral-onSurface"
                            }`}
                        >
                            <Upload size={18} />
                            <span>
                                {formData.arquivo
                                    ? formData.arquivo.name
                                    : "Clique para selecionar um arquivo"}
                            </span>
                        </div>
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
                        {loading ? "Enviando..." : "Solicitar Recurso"}
                    </button>
                </div>
            </form>
        </div>
    );
}
