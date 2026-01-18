import { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import { Candidato, FichaCandidatoProvaPratica } from "../types/Candidato";
import { UsuarioAvaliador } from "../types/Usuario";
import { ProvaAccordionDTO } from "../types/Avaliacao";
import { Categoria } from "../types/Categoria";
import {
    listarCandidatos,
    listarUsuriosAvaliadores,
    buscarEstruturaAvaliacao,
    listarCategorias,
    criarAvaliacaoCompleta,
    buscarFichaCandidatoPorId
} from "../services/api";
import { toast } from "react-toastify";
import AvaliacaoAccordion from "../components/AvaliacaoPratica/AvaliacaoAccordion";
import { ClipboardCheck, Filter, User, Users, ShieldCheck } from "lucide-react";

export default function AvaliacaoPage() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");
    const [candidatoSelecionado, setCandidatoSelecionado] = useState<number | null>(null);
    const [avaliadorSelecionado, setAvaliadorSelecionado] = useState<number | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [avaliadores, setAvaliadores] = useState<UsuarioAvaliador[]>([]);
    const [provasSelecionadas, setProvasSelecionadas] = useState<ProvaAccordionDTO[]>([]);
    const [notas, setNotas] = useState<Record<number, number>>({});
    const [comentarios, setComentarios] = useState<Record<number, string>>({});
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [ficha, setFicha] = useState<FichaCandidatoProvaPratica | null>(null);

    // --- Estilos Padronizados ---
    const selectClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        if (usuarioLogado.funcao === "AVALIADOR") {
            setAvaliadorSelecionado(usuarioLogado.id);
        }
    }, [usuarioLogado]);

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
        const fetchAvaliadores = async () => {
            try {
                const response = await listarUsuriosAvaliadores();
                setAvaliadores(response as UsuarioAvaliador[]);
            } catch {
                toast.error("Erro ao carregar avaliadores");
            }
        };
        fetchAvaliadores();
    }, []);

    useEffect(() => {
        const fetchEstrutura = async () => {
            if (!candidatoSelecionado || !avaliadorSelecionado) {
                setProvasSelecionadas([]);
                return;
            }

            try {
                const response = await buscarEstruturaAvaliacao(
                    avaliadorSelecionado,
                    candidatoSelecionado
                );
                setProvasSelecionadas(response as ProvaAccordionDTO[]);
            } catch {
                toast.error("Erro ao carregar estrutura da avaliação");
            }
        };

        fetchEstrutura();
    }, [candidatoSelecionado, avaliadorSelecionado]);

    useEffect(() => {
        const fetchFicha = async () => {
            if (!candidatoSelecionado) {
                setFicha(null);
                return;
            }
            try {
                const response = await buscarFichaCandidatoPorId(Number(candidatoSelecionado));
                setFicha(response as FichaCandidatoProvaPratica);
            } catch {
                toast.error("Erro ao carregar ficha do candidato");
            }
        };
        fetchFicha();
    }, [candidatoSelecionado]);

    const handleSalvarAvaliacao = async () => {
        try {
            if (!avaliadorSelecionado || !candidatoSelecionado) {
                toast.error("Selecione candidato e avaliador");
                return;
            }

            const avaliadorId = usuarioLogado?.funcao === "AVALIADOR"
                ? usuarioLogado.id
                : avaliadorSelecionado;

            if (!avaliadorId) {
                toast.error("Avaliador inválido");
                return;
            }

            const avaliador = avaliadores.find(a => a.idUsuario === avaliadorId);
            const comissaoId = avaliador?.ComissaoUsuario?.comissaoId ?? 0;
            const provaPraticaId = provasSelecionadas[0]?.idProvaPratica ?? 0;

            for (const bloco of provasSelecionadas[0]?.blocosProvas ?? []) {
                const payload = {
                    comissaoId,
                    avaliadorId: avaliadorId,
                    candidatoId: candidatoSelecionado,
                    blocoProvaId: bloco.idBloco,
                    provaPraticaId,
                    quesitos: bloco.quesitos.map((quesito) => ({
                        quesitoId: quesito.idQuesito,
                        comentario: comentarios[quesito.idQuesito] ?? "",
                        subQuesitos: quesito.subQuesitos.map((sub) => ({
                            subQuesitoId: sub.idSubequestios,
                            notaSubQuesito: Number(notas[sub.idSubequestios] ?? 0),
                        })),
                    })),
                    ficha: {
                        idFicha: ficha?.idFicha,
                        concursoId: ficha?.concursoId,
                        notaFinalProvaPratica: ficha?.notaFinalProvaPratica,
                    },
                };

                await criarAvaliacaoCompleta(payload);
            }

            toast.success("Avaliações por bloco salvas com sucesso!");

            setNotas({});
            setComentarios({});
            setCandidatoSelecionado(null);
            setAvaliadorSelecionado(null);
            setProvasSelecionadas([]);
            setFicha(null);

        } catch (error) {
            toast.error("Erro ao salvar avaliações");
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
                
                {/* CARD UNIFICADO */}
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col min-h-[600px]">
                    
                    {/* CABEÇALHO */}
                    <div className="p-6 border-b border-outline-variant">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <ClipboardCheck size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Avaliação Prática</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">
                                    Selecione o candidato e atribua as notas conforme os quesitos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CONTEÚDO PRINCIPAL */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                        
                        {/* FILTROS (Grid) */}
                        <div className={`grid gap-6 mb-8 ${usuarioLogado?.funcao === "AVALIADOR" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                            
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
                                            const candidato = candidatos.find(c => c.idCandidato === id);
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

                            {/* Avaliador (Se admin) */}
                            {usuarioLogado?.funcao !== "AVALIADOR" && (
                                <div>
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-primary"/> Avaliador Responsável
                                        </span>
                                    </label>
                                    <select
                                        className={selectClass}
                                        value={avaliadorSelecionado ?? ""}
                                        onChange={(e) => setAvaliadorSelecionado(e.target.value ? Number(e.target.value) : null)}
                                    >
                                        <option value="">Selecione</option>
                                        {avaliadores.map((a) => (
                                            <option key={a.idUsuario} value={a.idUsuario}>
                                                {a.nomeCompleto}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* ÁREA DA PLANILHA (Accordion) */}
                        <div className="flex-1">
                            {!candidatoSelecionado || (!avaliadorSelecionado && usuarioLogado?.funcao !== "AVALIADOR") ? (
                                <div className="text-center py-20 border-2 border-dashed border-outline-variant rounded-xl bg-surface-containerHigh/30">
                                    <Users className="mx-auto h-12 w-12 text-neutral-onSurface opacity-20 mb-4" />
                                    <p className="text-lg font-semibold text-neutral-onSurface opacity-60">
                                        Aguardando Seleção
                                    </p>
                                    <p className="text-sm text-neutral-onSurface opacity-40">
                                        Selecione um candidato {usuarioLogado?.funcao !== "AVALIADOR" && "e um avaliador"} para iniciar.
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-fadeIn">
                                    <AvaliacaoAccordion
                                        provas={provasSelecionadas}
                                        notas={notas}
                                        comentarios={comentarios}
                                        onChangeNota={(id, nota) => setNotas((prev) => ({ ...prev, [id]: nota }))}
                                        onChangeComentario={(id, comentario) => setComentarios((prev) => ({ ...prev, [id]: comentario }))}
                                        onSalvar={handleSalvarAvaliacao}
                                        categoriaSelecionada={categoriaSelecionada}
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