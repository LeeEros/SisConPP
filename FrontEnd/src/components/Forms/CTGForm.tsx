import React, { useState, useEffect } from 'react';
import { listarRTs, atualizarCTG, cadastrarCTG } from '../../services/api';
import { CTG } from '../../types/CTG';
import { toast } from 'react-toastify';
import { Save, XCircle } from 'lucide-react';

interface RT {
    idRT: number;
    nomeRT: string;
}

interface CTGFormProps {
    onClose: () => void;
    ctgToEdit?: CTG;
}

export default function CTGForm({ onClose, ctgToEdit }: CTGFormProps) {
    const [formData, setFormData] = useState<CTG>({
        idCTG: 0,
        nomeCTG: '',
        RTid: 0,
    });

    const [rts, setRTs] = useState<RT[]>([]); 
    const [selectedRT, setSelectedRT] = useState<number>(0); 

    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        const fetchRTs = async () => {
            const response = await listarRTs();
            setRTs(response as RT[]);
        };
        fetchRTs();
    }, []);

    useEffect(() => {
        if (ctgToEdit) {
            setFormData({
                ...ctgToEdit,
                RTid: Number(ctgToEdit.RTid),
            });
            setSelectedRT(Number(ctgToEdit.RTid));
        }
    }, [ctgToEdit]);  

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: CTG) => ({
            ...prev,
            [name]: name === 'idCTG' ? Number(value) : value,
        }));
    };

    const handleRTChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRT(Number(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const ctgPayload: CTG = {
                idCTG: ctgToEdit ? ctgToEdit.idCTG : 0,
                nomeCTG: formData.nomeCTG,
                RTid: selectedRT,
            };

            if (ctgToEdit) {
                await atualizarCTG(ctgPayload);
                toast.success('CTG atualizado com sucesso!');
            } else {
                await cadastrarCTG(ctgPayload);
                toast.success('CTG cadastrado com sucesso!');
            }

            onClose();
        } catch (error) {
            console.error('Erro ao salvar CTG:', error);
            toast.error('Erro ao salvar CTG. Verifique os dados.');
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark">
                    {ctgToEdit ? 'Editar CTG' : 'Novo CTG'}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Preencha os dados do Centro de Tradições Gaúchas.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={labelClass}>Nome do CTG</label>
                    <input
                        type="text"
                        name="nomeCTG"
                        value={formData.nomeCTG}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: CTG Herança do Pago"
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Região Tradicionalista (RT)</label>
                    <select
                        name="RTid"
                        value={selectedRT || ""}
                        onChange={handleRTChange}
                        className={inputClass}
                        required
                    >
                        <option value="">Selecione uma RT...</option>
                        {rts.map((rt) => (
                            <option key={rt.idRT} value={rt.idRT}>
                                {rt.nomeRT}
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-dark text-secondary-on rounded-xl shadow-md transition font-bold"
                    >
                        <Save size={18} />
                        {ctgToEdit ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </div>
    );
}