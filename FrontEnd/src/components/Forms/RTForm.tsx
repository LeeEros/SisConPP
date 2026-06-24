import React, { useEffect, useState } from 'react';
import { cadastrarRT, atualizarRT } from '../../services/api';
import { RT } from '../../types/RT';
import { toast } from 'react-toastify';
import { Save, XCircle } from 'lucide-react';

interface RTFormProps {
  onClose: () => void;
  rtToEdit?: RT;
}

export default function RTForm({ onClose, rtToEdit }: RTFormProps) {
  const [formData, setFormData] = useState<RT>({
    idRT: 0,
    nomeRT: '',
    numeroRT: 0,
  });
  
  const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
  const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

  useEffect(() => {
    if (rtToEdit) {
      setFormData(rtToEdit);
    }
  }, [rtToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numeroRT' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (rtToEdit) {
        await atualizarRT(formData);
        toast.success('RT atualizada com sucesso!');
      } else {
        await cadastrarRT(formData);
        toast.success('RT cadastrada com sucesso!');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar RT:', error);
      toast.error('Erro ao salvar RT. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="w-full text-neutral-onBackground">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">
            {rtToEdit ? 'Editar RT' : 'Nova RT'}
        </h1>
        <p className="text-sm text-neutral-onSurface opacity-70">
            Informe os dados da Região Tradicionalista.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Nome da Região Tradicionalista</label>
          <input
            type="text"
            name="nomeRT"
            value={formData.nomeRT}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: 18ª Região Tradicionalista"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Número da RT</label>
          <input
            type="number"
            name="numeroRT"
            value={formData.numeroRT || ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: 18"
            required
          />
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
                {rtToEdit ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
        </div>
      </form>
    </div>
  );
}