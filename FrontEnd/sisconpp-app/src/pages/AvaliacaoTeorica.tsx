import { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import { Candidato, FichaCandidato } from "../types/Candidato";
import { Categoria } from "../types/Categoria";
import { ProvaTeoricaAccordionDTO } from "../types/Avaliacao";
import {
    listarCandidatos,
    listarCategorias,
    buscarEstruturaTeorica,
    criarAvaliacaoTeorica,
    buscarFichaCandidatoPorId,
} from "../services/api";
import { toast } from "react-toastify";
import AvaliacaoAccordion from "../components/AvalicaoTeorica/AvaliacaoTeorica";
import { BookOpenCheck, Filter, User, BookDashed } from "lucide-react";

export default function AvaliacaoTeoricaPage() {
    const [candidatoSelecionado, setCandidatoSelecionado] = useState<number | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [provasSelecionadas, setProvasSelecionadas] = useState<ProvaTeoricaAccordionDTO[]>([]);
    const [notas, setNotas] = useState<Record<number, number>>({});
    const [comentarios, setComentarios] = useState<Record<number, string>>({});
    const [ficha, setFicha] = useState<FichaCandidato | null>(null);

    // Estilos Padronizados
    const selectClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    const usuarioLogado = (() => {
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            return usuario?.id ?? null;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        const fetchCandidatos = async () => {
            try {
                const response = await listarCandidatos();
                setCandidatos(response as Candidato[]);
            } catch {
                toast.error("Erro ao carregar candidatos");
            }
        };
        fetchCandidatos();
    }, []);

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
        const fetchEstrutura = async () => {
            if (!candidatoSelecionado) {
                setProvasSelecionadas([]);
                return;
            }

            try {
                const response = await buscarEstruturaTeorica(Number(candidatoSelecionado));
                setProvasSelecionadas(response as ProvaTeoricaAccordionDTO[]);
            } catch {
                toast.error("Erro ao carregar estrutura da prova teórica");
            }
        };

        fetchEstrutura();
    }, [candidatoSelecionado]);


    useEffect(() => {
        const fetchFicha = async () => {
            if (!candidatoSelecionado) {
                setFicha(null);
                return;
            }
            try {
                const response = await buscarFichaCandidatoPorId(Number(candidatoSelecionado));
                setFicha(response as FichaCandidato);
            } catch {
                toast.error("Erro ao carregar ficha do candidato");
            }
        };
        fetchFicha();
    }, [candidatoSelecionado]);

    const resetPagina = () => {
        setCandidatoSelecionado(null);
        setCategoriaSelecionada(null);
        setProvasSelecionadas([]);
        setNotas({});
        setComentarios({});
        setFicha(null);
    };


    const handleSalvarAvaliacao = async () => {
        try {
            if (!candidatoSelecionado || !ficha) {
                toast.error("Candidato ou ficha não carregados");
                return;
            }
            
            for (const prova of provasSelecionadas) {
                const payload = {
                    candidatoId: Number(candidatoSelecionado),
                    avaliadorId: usuarioLogado,
                    provaTeoricaId: prova.idprovaTeorica,
                    quesitos: prova.quesitos.map((quesito) => ({
                        quesitoId: quesito.idQuesito,
                        notaQuesito: notas[quesito.idQuesito] ?? 0,
                        comentario: comentarios[quesito.idQuesito] ?? undefined,
                        subQuesitos: quesito.subQuesitos?.map((sub) => ({
                            subQuesitoId: sub.idSubequestios,
                            notaSubQuesito: notas[sub.idSubequestios] ?? 0,
                        })),
                    })),
                    ficha: {
                        idFicha: ficha.idFicha,
                        concursoId: ficha.concursoId,
                        notaFinalProvaTeorica: ficha.notaFinalProvaTeorica ?? 0,
                        anexoGabarito: ficha.anexoGabarito ?? "",
                        anexoRedacao: ficha.anexoRedacao ?? "",
                    },
                };

                await criarAvaliacaoTeorica(payload);
                resetPagina();
            }

            toast.success("Avaliação teórica salva com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar avaliação teórica");
        }
    };


    return (
        <div className="flex min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-screen">
                
                {/* CARD UNIFICADO */}
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col min-h-[600px]">
                    
                    {/* CABEÇALHO */}
                    <div className="p-6 border-b border-outline-variant">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <BookOpenCheck size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Avaliação Teórica</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">
                                    Lançamento de notas da prova escrita e redação.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CONTEÚDO PRINCIPAL */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                        
                        {/* FILTROS */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            
                            {/* Categoria */}
                            <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-2">
                                        <Filter size={16} className="text-primary"/> Categoria
                                    </span>
                                </label>
                                <select
                                    className={selectClass}
                                    value={categoriaSelecionada ?? ""}
                                    onChange={(e) => setCategoriaSelecionada(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">Selecione</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.idCategoria} value={cat.idCategoria}>
                                            {cat.nomeCategoria}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Candidato */}
                            <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-2">
                                        <User size={16} className="text-primary"/> Candidato
                                    </span>
                                </label>
                                <select
                                    className={selectClass}
                                    value={candidatoSelecionado ?? ""}
                                    onChange={(e) => {
                                        const id = e.target.value ? Number(e.target.value) : null;
                                        setCandidatoSelecionado(id);
                                        if (id) {
                                            const candidato = candidatos.find((c) => c.idCandidato === id);
                                            if (candidato) setCategoriaSelecionada(candidato.categoriaId ?? null);
                                        } else {
                                            setCategoriaSelecionada(null);
                                        }
                                    }}
                                >
                                    <option value="">Selecione</option>
                                    {candidatos
                                        .filter((c) => categoriaSelecionada ? c.categoriaId === categoriaSelecionada : true)
                                        .map((c) => (
                                            <option key={c.idCandidato} value={c.idCandidato}>
                                                {c.nomeCompleto}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        {/* ÁREA DE AVALIAÇÃO */}
                        <div className="flex-1">
                            {!candidatoSelecionado ? (
                                <div className="text-center py-20 border-2 border-dashed border-outline-variant rounded-xl bg-surface-containerHigh/30">
                                    <BookDashed className="mx-auto h-12 w-12 text-neutral-onSurface opacity-20 mb-4" />
                                    <p className="text-lg font-semibold text-neutral-onSurface opacity-60">
                                        Aguardando Candidato
                                    </p>
                                    <p className="text-sm text-neutral-onSurface opacity-40">
                                        Selecione um candidato acima para iniciar a avaliação.
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-fadeIn">
                                    <AvaliacaoAccordion
                                        provas={provasSelecionadas}
                                        notas={notas}
                                        comentarios={comentarios}
                                        onChangeNota={(id, nota) => setNotas((prev) => ({ ...prev, [id]: nota }))}
                                        onChangeComentario={(id, comentario) =>
                                            setComentarios((prev) => ({ ...prev, [id]: comentario }))
                                        }
                                        onSalvar={handleSalvarAvaliacao}
                                        onChangeAnexoGabarito={(file) => {
                                            if (file) {
                                                setFicha((prev) => prev ? { ...prev, anexoGabarito: file.name } : prev);
                                            }
                                        }}
                                        onChangeAnexoRedacao={(file) => {
                                            if (file) {
                                                setFicha((prev) => prev ? { ...prev, anexoRedacao: file.name } : prev);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}