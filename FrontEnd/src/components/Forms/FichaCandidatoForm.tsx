import React, { useEffect, useState } from "react";
import { FichaCandidatoPayload } from "../../types/Candidato";
import { Concurso } from "../../types/Concurso";
import { criarFichaCandidato, listarConcurso } from "../../services/api";
import { toast } from "react-toastify";
import { Save, XCircle, FilePlus2, Trophy } from "lucide-react";

interface FichaCandidatoProps {
    onClose: () => void;
    candidatoToEdit: FichaCandidatoPayload;
}

export default function FichaCandidatoForm({
    onClose,
    candidatoToEdit,
}: FichaCandidatoProps) {
    const [formData, setFormData] = useState<FichaCandidatoPayload>({
        candidatoId: 0,
        concursoId: 0,
    });

    const [concursos, setConcursos] = useState<Concurso[]>([]);

    // --- Estilos Padronizados ---
    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        if (candidatoToEdit) {
            setFormData({
                candidatoId: candidatoToEdit.candidatoId,
                concursoId: candidatoToEdit.concursoId ?? 0,
            });
        }
    }, [candidatoToEdit]);

    useEffect(() => {
        const fetchConcursos = async () => {
            try {
                const response = (await listarConcurso()) as Concurso[];
                setConcursos(response);
            } catch (error) {
                console.error("Erro ao buscar concursos", error);
                toast.error("Erro ao carregar lista de concursos.");
            }
        };

        fetchConcursos();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fichaCandidatoPayload: FichaCandidatoPayload = {
            candidatoId: formData.candidatoId,
            concursoId: formData.concursoId,
        };

        try {
            console.log("Payload enviado:", fichaCandidatoPayload);
            await criarFichaCandidato(fichaCandidatoPayload);
            toast.success("Ficha do Candidato criada com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error("Erro ao criar a ficha.");
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <FilePlus2 className="text-primary" />
                    Ficha do Candidato
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Vincule o candidato a um concurso para iniciar o processo de avaliação.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label className={labelClass} htmlFor="concursoId">
                        <span className="flex items-center gap-2">
                            <Trophy size={16} className="text-primary" />
                            Selecione o Concurso
                        </span>
                    </label>

                    <div className="relative">
                        <select
                            id="concursoId"
                            name="concursoId"
                            value={formData.concursoId}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value={0} disabled>
                                -- Selecione um concurso disponível --
                            </option>

                            {concursos.map((concurso) => (
                                <option
                                    key={concurso.idConcurso}
                                    value={concurso.idConcurso}
                                >
                                    {concurso.nomeConcurso}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-xs text-neutral-onSurface opacity-50 mt-1 pl-1">
                        Isso habilitará as planilhas de notas para este candidato neste evento.
                    </p>
                </div>

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
                        className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-dark text-secondary-on rounded-xl shadow-md transition font-bold"
                    >
                        <Save size={18} />
                        Salvar Ficha
                    </button>
                </div>
            </form>
        </div>
    );
}