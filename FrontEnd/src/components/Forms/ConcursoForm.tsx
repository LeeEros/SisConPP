import React, { useEffect, useState } from 'react';
import { Concurso } from '../../types/Concurso';
import { cadastrarConcurso, atualizarConcurso } from '../../services/api';
import { toast } from 'react-toastify';
import { Trophy, Save, XCircle, Calendar, MapPin, FileText } from 'lucide-react';

interface ConcursoFormProps {
    onClose: () => void;
    concursoToEdit?: Concurso;
}

export default function ConcursoForm({ onClose, concursoToEdit }: ConcursoFormProps) {
    const [formData, setFormData] = useState<Concurso>({
        idConcurso: 0,
        nomeConcurso: '',
        lancamentoEdital: new Date(),
        inscricoesInicio: new Date(),
        inscricoesFinal: new Date(),
        dataProvaEscrita: new Date(),
        dataProvasPraticas: new Date(),
        dataResultado: new Date(),
        local: '',
        anexoEdital: undefined,
    });
    const [loading, setLoading] = useState(false);

    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5 flex items-center gap-1";

    useEffect(() => {
        if (concursoToEdit) {
            setFormData(concursoToEdit);
        }
    }, [concursoToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'date' ? new Date(value) : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                anexoEdital: file,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (formData.idConcurso && formData.idConcurso > 0) {
                await atualizarConcurso(formData);
                toast.success('Concurso atualizado com sucesso!');
            } else {
                await cadastrarConcurso(formData);
                toast.success('Concurso cadastrado com sucesso!');
            }
            onClose();
        } catch (error) {
            console.error('Erro ao salvar Concurso:', error);
            toast.error('Erro ao salvar Concurso. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    const renderDate = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
    };

    return (
        <div className="w-full text-neutral-onBackground">
            
            {/* Cabeçalho */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <Trophy className="text-primary" /> 
                    {concursoToEdit ? 'Editar Concurso' : 'Novo Concurso'}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Preencha os dados do edital, datas e local.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Dados Gerais */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className={labelClass}><FileText size={14}/> Nome do Concurso</label>
                        <input
                            type="text"
                            name="nomeConcurso"
                            value={formData.nomeConcurso}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ex: 25º Concurso Estadual de Prendas"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClass}><MapPin size={14}/> Local</label>
                        <input
                            type="text"
                            name="local"
                            value={formData.local}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ex: CTG Farroupilha - Alegrete/RS"
                            required
                        />
                    </div>
                </div>

                {/* Datas - Grid Compacto */}
                <div className="p-4 bg-surface-containerLowest border border-outline-variant rounded-xl">
                    <h3 className="text-sm font-bold text-primary-dark mb-3 flex items-center gap-2">
                        <Calendar size={16}/> Cronograma
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Lançamento do Edital</label>
                            <input type="date" name="lancamentoEdital" value={renderDate(formData.lancamentoEdital)} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Divulgação do Resultado</label>
                            <input type="date" name="dataResultado" value={renderDate(formData.dataResultado)} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Início das Inscrições</label>
                            <input type="date" name="inscricoesInicio" value={renderDate(formData.inscricoesInicio)} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Fim das Inscrições</label>
                            <input type="date" name="inscricoesFinal" value={renderDate(formData.inscricoesFinal)} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Prova Escrita</label>
                            <input type="date" name="dataProvaEscrita" value={renderDate(formData.dataProvaEscrita)} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Provas Práticas</label>
                            <input type="date" name="dataProvasPraticas" value={renderDate(formData.dataProvasPraticas)} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>
                </div>

                {/* Anexo */}
                <div>
                    <label className={labelClass}>Anexo do Edital (PDF)</label>
                    <input
                        type="file"
                        name="anexoEdital"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-neutral-onSurface
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-xl file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary-container file:text-primary-dark
                            hover:file:bg-primary/20
                            cursor-pointer border border-outline rounded-xl bg-surface-containerHigh"
                    />
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
                        {loading ? 'Salvando...' : (concursoToEdit ? 'Salvar Alterações' : 'Cadastrar')}
                    </button>
                </div>
            </form>
        </div>
    );
}