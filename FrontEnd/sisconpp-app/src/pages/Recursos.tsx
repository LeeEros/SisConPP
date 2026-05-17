import { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import Modal from "../components/Modal/Modal";
import RecursoForm from "../components/Forms/RecursoForm";
import RecursoList from "../components/Lists/RecursoList";
import RecursoView from "../components/View/RecursoView";
import { listarRecursos, alterarStatusRecurso } from "../services/api";
import { Recurso, StatusRecurso } from "../types/Recurso";
import { toast } from "react-toastify";
import { Scale, Plus, Search } from "lucide-react";

export default function RecursosPage() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [recursoSelecionado, setRecursoSelecionado] = useState<Recurso | null>(null);

  const inputClass =
    "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 pl-10 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";

  useEffect(() => {
    fetchRecursos();
  }, []);

  const fetchRecursos = async () => {
    setLoading(true);
    try {
      const data = await listarRecursos();
      setRecursos(data as Recurso[]);
    } catch {
      toast.error("Erro ao carregar recursos.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, deferir: boolean) => {
    try {
      const status: StatusRecurso = deferir ? "DEFERIDO" : "INDEFERIDO";

      await alterarStatusRecurso(id, status);

      toast.success(`Recurso ${status} com sucesso.`);
      setRecursoSelecionado(null);
      fetchRecursos();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar o julgamento do recurso.");
    }
  };

  const filteredRecursos = recursos.filter((r) => {
    const term = searchTerm.toLowerCase();

    return (
      r.nomeRecurso.toLowerCase().includes(term) ||
      (r.justificativa ?? "").toLowerCase().includes(term) ||
      (r.Candidato?.nomeCompleto ?? "").toLowerCase().includes(term) ||
      (r.Usuario?.nomeCompleto ?? "").toLowerCase().includes(term) ||
      (r.Quesito?.nomeQuesito ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-row min-h-screen w-full bg-neutral-background">
      <SideNavBar />

      <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">

        <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col">
          <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                <Scale size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-dark">Gestão de Recursos</h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                  Analise e julgue as solicitações de revisão de nota.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 font-bold"
            >
              <Plus size={20} />
              Novo Recurso
            </button>
          </div>

          {/* CONTEÚDO */}
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            {/* BUSCA */}
            <div className="mb-6 w-full md:w-1/3 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-onSurface opacity-50"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por recurso, candidato, avaliador, quesito..."
                className={inputClass}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* LISTA */}
            <div className="w-full">
              <RecursoList
                recursos={filteredRecursos}
                loading={loading}
                onView={(rec) => setRecursoSelecionado(rec)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* MODAL CRIAÇÃO */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <RecursoForm
          onClose={() => {
            setIsFormOpen(false);
            fetchRecursos();
          }}
        />
      </Modal>

      {/* MODAL VISUALIZAÇÃO / JULGAMENTO */}
      <Modal isOpen={!!recursoSelecionado} onClose={() => setRecursoSelecionado(null)}>
        {recursoSelecionado && (
          <RecursoView
            recurso={recursoSelecionado}
            onClose={() => setRecursoSelecionado(null)}
            onIndeferir={() => handleStatusChange(recursoSelecionado.idRecurso, false)}
            onDeferir={() => handleStatusChange(recursoSelecionado.idRecurso, true)}
          />
        )}
      </Modal>
    </div>
  );
}
