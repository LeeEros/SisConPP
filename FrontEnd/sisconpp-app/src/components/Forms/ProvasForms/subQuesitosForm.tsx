import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { criarSubQuesito, listarQuesitos } from "../../../services/api";
import { Quesitos, SubQuesitos, SubGrupoVivencia } from "../../../types/ProvaPratica";
import { Save, XCircle, ListMinus, HelpCircle } from "lucide-react";

const SUBGRUPOS_VIVENCIA: { value: SubGrupoVivencia; label: string }[] = [
  { value: SubGrupoVivencia.APRESENTACAO_PASTA, label: "Apresentação da pasta de vivência" },
  { value: SubGrupoVivencia.APROVEITAMENTO_TEMPO, label: "Aproveitamento do tempo no movimento tradicionalista" },
  { value: SubGrupoVivencia.COLABORACAO_PROMOCOES, label: "Colaboração na organização de promoções tradicionalistas" },
  { value: SubGrupoVivencia.PARTICIPACAO_EVENTOS, label: "Participação ou frequência em eventos tradicionalistas" },
];

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
  const [loading, setLoading] = useState(false);
  const [isVivencia, setIsVivencia] = useState(false);

  const [formData, setFormData] = useState<{
    nomeSubquesito: string;
    notaSubequesito: number;
    quesitoId: number;
    subGrupo: SubGrupoVivencia | "";
  }>({
    nomeSubquesito: "",
    notaSubequesito: 0,
    quesitoId: 0,
    subGrupo: "",
  });

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
  const labelClass =
    "block text-sm font-semibold text-neutral-onSurface mb-1.5";

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

  useEffect(() => {
    if (subQuesitoToEdit) {
      setFormData({
        nomeSubquesito: subQuesitoToEdit.nomeSubquesito,
        notaSubequesito: subQuesitoToEdit.notaSubequesito,
        quesitoId: subQuesitoToEdit.quesitoId,
        subGrupo: subQuesitoToEdit.subGrupo ?? "",
      });
      setIsVivencia(!!subQuesitoToEdit.subGrupo);
    } else if (quesitoId) {
      setFormData((prev) => ({ ...prev, quesitoId }));
    }
  }, [subQuesitoToEdit, quesitoId]);

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

  const handleToggleVivencia = () => {
    const newState = !isVivencia;
    setIsVivencia(newState);

    if (!newState) {
      setFormData((prev) => ({ ...prev, subGrupo: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    if (isVivencia && !formData.subGrupo) {
      toast.warning("Selecione um subgrupo da Vivência.");
      return;
    }

    try {
      setLoading(true);

      const payload: SubQuesitos = {
        idSubequestios: subQuesitoToEdit?.idSubequestios || 0,
        nomeSubquesito: formData.nomeSubquesito,
        notaSubequesito: formData.notaSubequesito,
        quesitoId: formData.quesitoId,
        subGrupo: isVivencia ? (formData.subGrupo as SubGrupoVivencia) : null,
      };

      await criarSubQuesito(payload);
      toast.success(subQuesitoToEdit ? "Subquesito atualizado!" : "Subquesito criado!");
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
          <label className={labelClass} htmlFor="nomeSubquesito">Nome do Subquesito</label>
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

        {/* Nota + Quesito Pai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="notaSubequesito">Nota Máxima</label>
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
            <label className={labelClass} htmlFor="quesitoId">Quesito Pai</label>
            <select
              id="quesitoId"
              name="quesitoId"
              value={formData.quesitoId}
              onChange={handleChange}
              required
              disabled
              className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="0" disabled>Selecione um Quesito</option>
              {listaQuesitos.map((quesito) => (
                <option key={quesito.idQuesito} value={quesito.idQuesito}>
                  {quesito.nomeQuesito}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox Estilizado */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl border border-outline bg-surface-containerLowest hover:bg-surface-container transition-colors cursor-pointer"
          onClick={handleToggleVivencia}
        >
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
              isVivencia
                ? "bg-primary border-primary"
                : "border-outline-variant bg-surface-containerHigh"
            }`}
          >
            {isVivencia && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-onSurface">
              Pertence à Vivência Tradicionalista?
            </span>
            <span className="text-xs text-neutral-onSurface opacity-60">
              Habilita seleção de subgrupos específicos.
            </span>
          </div>
        </div>

        {/* Select Subgrupo */}
        {isVivencia && (
          <div className="animate-fadeIn">
            <label className={labelClass} htmlFor="subGrupo">
              <span className="flex items-center gap-1">
                <HelpCircle size={14} /> Subgrupo da Vivência
              </span>
            </label>
            <select
              id="subGrupo"
              name="subGrupo"
              value={formData.subGrupo}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subGrupo: e.target.value as SubGrupoVivencia,
                }))
              }
              className={inputClass}
              required
            >
              <option value="" disabled>Selecione um subgrupo</option>
              {SUBGRUPOS_VIVENCIA.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        )}

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
            {loading ? "Salvando..." : (subQuesitoToEdit ? "Salvar Alterações" : "Criar")}
          </button>
        </div>
      </form>
    </div>
  );
}