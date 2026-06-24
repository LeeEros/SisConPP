import React, { useState, useEffect } from 'react';
import { BlocoProva } from '../../../types/ProvaPratica';
import { toast } from 'react-toastify';
import { criarBlocoProva } from '../../../services/api';
import { Save, XCircle, Layers } from 'lucide-react';

export interface BlocoProvaFormState {
    idBloco?: number;
    nomeBloco: string;
    notaMaximaBloco: number;
    provaPraticaId: number;
}

interface BlocoProvaFormProps {
    onClose: () => void;
    blocoToEdit?: BlocoProva;
    provaPraticaId?: number; 
}

export default function BlocoProvaForm({ onClose, blocoToEdit, provaPraticaId }: BlocoProvaFormProps) {

    const [formData, setFormData] = useState<BlocoProvaFormState>({
        nomeBloco: '',
        notaMaximaBloco: 0,
        provaPraticaId: provaPraticaId || 0,
    });
    const [loading, setLoading] = useState(false);

    // Estilos Padronizados
    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        if (blocoToEdit) {
            setFormData({
                idBloco: blocoToEdit.idBloco,
                nomeBloco: blocoToEdit.nomeBloco,
                notaMaximaBloco: blocoToEdit.notaMaximaBloco,
                provaPraticaId: blocoToEdit.provaPraticaId,
            });
        } else if (provaPraticaId) {
            setFormData(prev => ({ ...prev, provaPraticaId: provaPraticaId }));
        }
    }, [blocoToEdit, provaPraticaId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'notaMaximaBloco' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (formData.nomeBloco.trim() === '' || formData.notaMaximaBloco <= 0) {
                toast.warning('Preencha o nome do bloco e a nota máxima.');
                return;
            }

            setLoading(true);

            const payload: BlocoProva = {
                idBloco: formData.idBloco || 0,
                nomeBloco: formData.nomeBloco,
                notaMaximaBloco: formData.notaMaximaBloco,
                provaPraticaId: formData.provaPraticaId,
                quesitos: blocoToEdit?.quesitos || []
            };

            await criarBlocoProva(payload);            
            toast.success(blocoToEdit ? 'Bloco atualizado!' : 'Bloco criado!');
            onClose();

        } catch (error) {
            console.error("Erro ao salvar bloco:", error);
            toast.error('Erro ao salvar bloco.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            
            {/* Cabeçalho */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
                    <Layers className="text-primary" /> 
                    {blocoToEdit ? 'Editar Bloco' : 'Novo Bloco'}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Blocos agrupam quesitos dentro de uma prova prática.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className={labelClass} htmlFor="nomeBloco">Nome do Bloco</label>
                    <input
                        type="text"
                        id="nomeBloco"
                        name="nomeBloco"
                        value={formData.nomeBloco}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Bloco Artístico"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass} htmlFor="notaMaximaBloco">Nota Máxima do Bloco</label>
                    <input
                        type="number"
                        step="0.1"
                        id="notaMaximaBloco"
                        name="notaMaximaBloco"
                        value={formData.notaMaximaBloco}
                        onChange={handleChange}
                        required
                        min="0"
                        className={inputClass}
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
                        {loading ? "Salvando..." : (blocoToEdit ? 'Salvar Alterações' : 'Criar Bloco')}
                    </button>
                </div>
            </form>
        </div>
    );
}