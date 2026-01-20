import { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import Modal from "../components/Modal/Modal";
import ProvaTeoricaForm from "../components/Forms/ProvasForms/provaTeoricaForm";
import QuesitoForm from "../components/Forms/ProvasForms/quesitosForm";
import SubQuesitosForm from "../components/Forms/ProvasForms/subQuesitosForm";
import { listarCategorias, buscarProvasTeoricas, buscarProvasTeoricasPorCategoria } from "../services/api";
import { Categoria } from "../types/Categoria";
import { ProvaTeorica, Quesitos, SubQuesitos } from "../types/ProvaTeorica";
import { Plus, BookOpen, Filter } from "lucide-react";
import { toast } from "react-toastify";
import ProvaAccordionTeorica from "../components/Provas/ProvaAccordionTeorica";

type ModalType = "PROVA" | "QUESITO" | "SUB" | null;

interface ProvaAccordionState extends ProvaTeorica {
    isOpen?: boolean;
}

export default function ProvaTeoricaCriacao() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
    const [provas, setProvas] = useState<ProvaAccordionState[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuesito, setSelectedQuesito] = useState<Quesitos>();
    const [selectedSub, setSelectedSub] = useState<SubQuesitos>();
    const [parentProvaId, setParentProvaId] = useState<number>();
    const [parentQuesitoId, setParentQuesitoId] = useState<number>();
    const [refresh, setRefresh] = useState(false);
    const [provasAbertas, setProvasAbertas] = useState<Set<number>>(new Set());;
    const [quesitosAbertos, setQuesitosAbertos] = useState<Set<number>>(new Set());

    // --- Estilos Padronizados ---
    const selectClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await listarCategorias();
                setCategorias(response as Categoria[]);
            } catch {
                toast.error("Erro ao carregar categorias");
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        const fetchProvas = async () => {
            setLoading(true);
            try {
                const response = categoriaSelecionada
                    ? await buscarProvasTeoricasPorCategoria(categoriaSelecionada)
                    : await buscarProvasTeoricas();

                const provasComEstado = (response as ProvaTeorica[]).map((p) => ({
                    ...p,
                    isOpen: p.idprovaTeorica ? provasAbertas.has(p.idprovaTeorica) : false,
                }));

                setProvas(provasComEstado);
            } catch {
                toast.error("Erro ao carregar provas teóricas");
            } finally {
                setLoading(false);
            }
        };
        fetchProvas();
    }, [categoriaSelecionada, refresh, provasAbertas]);

    const toggleProva = (provaId: number) => {
        setProvasAbertas(prev => {
            const novo = new Set(prev);
            if (novo.has(provaId)) {
                novo.delete(provaId);
            } else {
                novo.add(provaId);
            }
            return novo;
        });
    };

    const toggleQuesito = (quesitoId: number) => {
        setQuesitosAbertos(prev => {
            const novo = new Set(prev);
            if (novo.has(quesitoId)) {
                novo.delete(quesitoId);
            } else {
                novo.add(quesitoId);
            }
            return novo;
        });
    };

    const closeModalAndRefresh = () => {
        setIsModalOpen(false);
        setRefresh((prev) => !prev);
    };

    const openProvaModal = () => {
        setModalType("PROVA");
        setIsModalOpen(true);
    };

    const openQuesitoModal = (quesito?: Quesitos, provaId?: number) => {
        setSelectedQuesito(quesito);
        setParentProvaId(provaId);
        setModalType("QUESITO");
        setIsModalOpen(true);
    };

    const openSubModal = (sub?: SubQuesitos, quesitoId?: number) => {
        setSelectedSub(sub);
        setParentQuesitoId(quesitoId);
        setModalType("SUB");
        setIsModalOpen(true);
    };

    return (
        <div className="flex min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col min-h-[600px]">

                    <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Prova Teórica</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">
                                    Gerencie as provas escritas e seus quesitos.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => openProvaModal()}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 font-semibold"
                        >
                            <Plus size={20} />
                            Nova Prova Teórica
                        </button>
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col">

                        <div className="mb-8 w-full md:w-1/3">
                            <label className={labelClass}>
                                <span className="flex items-center gap-2">
                                    <Filter size={16} className="text-primary"/> Filtrar por Categoria
                                </span>
                            </label>
                            <select
                                className={selectClass}
                                value={categoriaSelecionada ?? ""}
                                onChange={(e) => setCategoriaSelecionada(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">Todas as Categorias</option>
                                {categorias.map((cat) => (
                                    <option key={cat.idCategoria} value={cat.idCategoria}>
                                        {cat.nomeCategoria}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            {loading && (
                                <div className="text-center py-10 text-neutral-onSurface opacity-50 animate-pulse">
                                    Carregando provas...
                                </div>
                            )}

                            {!loading && provas.length === 0 && (
                                <div className="text-center py-16 border-2 border-dashed border-outline-variant rounded-xl">
                                    <p className="text-neutral-onSurface opacity-50 font-medium">
                                        Nenhuma prova teórica encontrada. <br/>
                                        Selecione outra categoria ou crie uma nova prova.
                                    </p>
                                </div>
                            )}

                            {!loading && provas.map((prova) => (
                                <ProvaAccordionTeorica
                                    key={prova.idprovaTeorica}
                                    prova={prova}
                                    isOpen={!!prova.idprovaTeorica && provasAbertas.has(prova.idprovaTeorica)}
                                    onToggle={toggleProva}
                                    quesitosAbertos={quesitosAbertos}
                                    onToggleQuesito={toggleQuesito}
                                    onAddQuesito={(idQuesito) => openQuesitoModal(undefined, idQuesito)}
                                    onAddSub={(idQuesito) => openSubModal(undefined, idQuesito)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalType === "PROVA" && (
                    <ProvaTeoricaForm
                        onClose={closeModalAndRefresh}
                    />
                )}

                {modalType === "QUESITO" && (
                    <QuesitoForm
                        onClose={closeModalAndRefresh}
                        quesitoToEdit={selectedQuesito}
                        provaTeoricaId={parentProvaId!}
                    />
                )}

                {modalType === "SUB" && (
                    <SubQuesitosForm
                        onClose={closeModalAndRefresh}
                        subQuesitoToEdit={selectedSub}
                        quesitoId={parentQuesitoId}
                    />
                )}
            </Modal>
        </div>
    );
}