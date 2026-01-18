import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { criarSubQuesito, listarQuesitos } from "../../../services/api";
import { Quesitos } from "../../../types/ProvaPratica";
import { Save, XCircle, ListMinus } from "lucide-react";

export interface SubQuesitos {
  idSubequestios?: number;
  nomeSubquesito: string;
  notaSubequesito: number;
  quesitoId: number;
}

interface SubQuesitosFormProps {
  onClose: () => void;
  subQuesitoToEdit?: SubQuesitos;
  quesitoId?: number;
}

export default function SubQuesitosForm({
  onClose,
  subQuesitoToEdit,
  quesitoId,
}: SubQuesitosFormProps) {
  const [listaQuesitos, setListaQuesitos] = useState<Quesitos[]>([]);
  const [formData, setFormData] = useState({
    nomeSubquesito: "",
    notaSubequesito: 0,
    quesitoId: 0,
  });
  const [loading, setLoading] = useState(false);

  // estilos padronizados
  const inputClass =
    "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
  const labelClass =
    "block text-sm font-semibold text-neutral-onSurface mb-1.5";

  // carregar quesitos
  useEffect(() => {
    const carregarQuesitos = async () => {
      try {
        const response = await listarQuesitos();
        setListaQuesitos(response as unknown as Quesitos[]);
      } catch (error) {
        console.error("Erro ao carregar quesitos", error);
        toast.error("Não foi possível carregar a lista de quesitos.");
      }
    };
    carregarQuesitos();
  }, []);

  // preencher dados ao editar ou quando vem quesitoId
  useEffect(() => {
    if (subQuesitoToEdit) {
      setFormData({
        nomeSubquesito: subQuesitoToEdit.nomeSubquesito,
        notaSubequesito: subQuesitoToEdit.notaSubequesito,
        quesitoId: subQuesitoToEdit.quesitoId,
      });
    } else if (quesitoId) {
      setFormData((prev) => ({ ...prev, quesitoId }));
    }
  }, [subQuesitoToEdit, quesitoId]);

  // change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "notaSubequesito" || name === "quesitoId"
          ? Number(value)
          : value,
    }));
  };

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validações
    if (formData.nomeSubquesito.trim() === "") {
      toast.warning("Informe o nome do subquesito.");
      return;
    }

    if (formData.notaSubequesito === 0) {
      toast.warning("A nota não pode ser zero.");
      return;
    }

    if (formData.quesitoId <= 0) {
      toast.warning("Selecione um quesito válido.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        idSubequestios: subQuesitoToEdit?.idSubequestios || 0,
        ...formData,
      };

      await criarSubQuesito(payload);

      toast.success(
        subQuesitoToEdit
          ? "Subquesito atualizado com sucesso!"
          : "Subquesito criado com sucesso!"
      );

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o subquesito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-neutral-onBackground">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2">
          <ListMinus className="text-primary" />
          {subQuesitoToEdit ? "Editar Subquesito" : "Novo Subquesito"}
        </h1>
        <p className="text-sm text-neutral-onSurface opacity-70">
          Subdivisão de um quesito para avaliações detalhadas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
        <div>
          <label className={labelClass} htmlFor="nomeSubquesito">
            Nome do Subquesito
          </label>
          <input
            type="text"
            id="nomeSubquesito"
            name="nomeSubquesito"
            value={formData.nomeSubquesito}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Ex: Postura"
          />
        </div>

        {/* Nota + Quesito */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="notaSubequesito">
              Nota Máxima
            </label>
            <input
              type="number"
              step="0.1"
              id="notaSubequesito"
              name="notaSubequesito"
              value={formData.notaSubequesito}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Ex: 5 ou -5"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="quesitoId">
              Quesito Pai
            </label>
            <select
              id="quesitoId"
              name="quesitoId"
              value={formData.quesitoId}
              onChange={handleChange}
              required
              disabled
              className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="0" disabled>
                Selecione um Quesito
              </option>
              {listaQuesitos.map((quesito) => (
                <option key={quesito.idQuesito} value={quesito.idQuesito}>
                  {quesito.nomeQuesito}
                </option>
              ))}
            </select>
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
            {loading
              ? "Salvando..."
              : subQuesitoToEdit
              ? "Salvar Alterações"
              : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
}
