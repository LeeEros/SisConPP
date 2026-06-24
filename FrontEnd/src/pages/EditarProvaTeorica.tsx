import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import { Candidato, FichaCandidato } from "../types/Candidato";
import { Categoria } from "../types/Categoria";
import { ProvaTeoricaAccordionDTO } from "../types/Avaliacao";
import {
    listarCandidatos,
    listarCategorias,
    buscarEstruturaTeorica,
    buscarFichaCandidatoPorId,
    buscarAvaliacaoTeoricaSalva,
    atualizarAvaliacaoTeorica
} from "../services/api";
import { toast } from "react-toastify";
import EdicaoAvaliacaoTeoricaAccordion from "../components/EdiçãoProvaTeorica/EdicaoAvaliacaoTeoricaAccordion";
import { BookOpenCheck, Filter, User, BookDashed, ShieldAlert } from "lucide-react";

export default function EdicaoAvaliacaoTeoricaPage() {
    const navigate = useNavigate();
    const usuarioLogado = (() => {
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            return usuario;
        } catch {
            return null;
        }
    })();

    const [candidatoSelecionado, setCandidatoSelecionado] = useState<number | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [provasSelecionadas, setProvasSelecionadas] = useState<ProvaTeoricaAccordionDTO[]>([]);
    const [notas, setNotas] = useState<Record<number, number>>({});
    const [comentarios, setComentarios] = useState<Record<number, string>>({});
    const [ficha, setFicha] = useState<FichaCandidato | null>(null);

    // Armazena o ID da avaliação salva para usar no PUT
    const [mapaIdsAvaliacao, setMapaIdsAvaliacao] = useState<Record<number, number>>({});

    const selectClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    // 1. Bloqueio de Acesso
    useEffect(() => {
        if (!usuarioLogado || usuarioLogado.funcao !== "ADMINISTRADOR") {
            toast.error("Acesso restrito. Apenas administradores podem editar notas.");
            navigate("/");
        }
    }, [usuarioLogado, navigate]);

    // 2. Carregamentos Iniciais
    useEffect(() => {
        listarCandidatos().then(res => setCandidatos(res as Candidato[])).catch(() => toast.error("Erro ao carregar candidatos"));
        listarCategorias().then(res => setCategorias(res as Categoria[])).catch(() => toast.error("Erro ao carregar categorias"));
    }, []);

    useEffect(() => {
        if (!candidatoSelecionado) {
            setFicha(null);
            return;
        }
        buscarFichaCandidatoPorId(Number(candidatoSelecionado))
            .then(res => setFicha(res as FichaCandidato))
            .catch(() => toast.error("Erro ao carregar ficha do candidato"));
    }, [candidatoSelecionado]);

    // 3. Busca a Estrutura + Avaliação Salva e Preenche a Tela
    // O "Segredo" da Busca e Preenchimento
    useEffect(() => {
        const fetchAvaliacaoTeoricaExistente = async () => {
            if (!candidatoSelecionado) {
                setProvasSelecionadas([]);
                setNotas({});
                setComentarios({});
                setMapaIdsAvaliacao({});
                return;
            }

            try {
                // 1. Busca Estrutura
                const estrutura = await buscarEstruturaTeorica(Number(candidatoSelecionado));
                const provaArr = Array.isArray(estrutura) ? estrutura : [estrutura];

                // 2. Busca Respostas Salvas
                const avaliacoesSalvas = await buscarAvaliacaoTeoricaSalva(candidatoSelecionado);
                const respostas = Array.isArray(avaliacoesSalvas) ? avaliacoesSalvas : [avaliacoesSalvas];

                const notasExistentes: Record<number, number> = {};
                const comentariosExistentes: Record<number, string> = {};
                const mapaDeIds: Record<number, number> = {};

                // 3. Varredura do JSON
                respostas?.forEach((resposta: any) => {
                    // Mapeia o ID da prova com o ID da avaliação salva
                    if (resposta.provaTeoricaId && (resposta.idAvalicao || resposta.idAvaliacao)) {
                        mapaDeIds[resposta.provaTeoricaId] = resposta.idAvalicao || resposta.idAvaliacao;
                    }

                    // Pega a lista de quesitos avaliados
                    const listaQuesitos = resposta.quesitosAvaliados || [];

                    listaQuesitos.forEach((q: any) => {
                        // Preenche comentário (se houver)
                        if (q.comentario) comentariosExistentes[q.quesitoId] = q.comentario;

                        // NOTA DIRETA DO QUESITO (Para quesitos que não têm subquesitos)
                        if (q.notaQuesito !== undefined && q.notaQuesito !== null) {
                            notasExistentes[q.quesitoId] = Number(q.notaQuesito);
                        }

                        // Pega a lista de subquesitos avaliados (Para Redação e Questões Corretas)
                        const listaSubQuesitos = q.subQuesitosAvaliados || [];

                        listaSubQuesitos.forEach((sub: any) => {
                            // Extrai a nota usando os campos exatos do JSON retornado
                            if (sub.notaSubQuesito !== undefined && sub.notaSubQuesito !== null) {
                                // A chave para salvar a nota no State é SEMPRE o subQuesitoId
                                notasExistentes[sub.subQuesitoId] = Number(sub.notaSubQuesito);
                            }
                        });
                    });
                });

                setNotas(notasExistentes);
                setComentarios(comentariosExistentes);
                setMapaIdsAvaliacao(mapaDeIds);
                setProvasSelecionadas(provaArr as ProvaTeoricaAccordionDTO[]);

            } catch (error) {
                toast.error("Erro ao carregar os dados da avaliação teórica para edição.");
                console.error(error);
            }
        };

        fetchAvaliacaoTeoricaExistente();
    }, [candidatoSelecionado]);

    const resetPagina = () => {
        setCandidatoSelecionado(null);
        setCategoriaSelecionada(null);
        setProvasSelecionadas([]);
        setNotas({});
        setComentarios({});
        setFicha(null);
        setMapaIdsAvaliacao({});
    };

    // 4. Salvar as Edições (PUT)
    const handleSalvarEdicao = async () => {
        try {
            if (!candidatoSelecionado || !ficha) {
                toast.error("Candidato ou ficha não carregados");
                return;
            }

            let editouAlgum = false;

            for (const prova of provasSelecionadas) {
                const idAvaliacaoSalva = mapaIdsAvaliacao[prova.idprovaTeorica];

                if (!idAvaliacaoSalva) {
                    toast.warning(`Não há avaliação salva para a prova: ${prova.nomeProva}`);
                    continue;
                }

                // Monta o mesmo payload da criação
                const payload = {
                    candidatoId: Number(candidatoSelecionado),
                    avaliadorId: Number(usuarioLogado?.id),
                    provaTeoricaId: Number(prova.idprovaTeorica),
                    quesitos: prova.quesitos.map((quesito) => ({
                        quesitoId: Number(quesito.idQuesito),
                        notaQuesito: Number(notas[quesito.idQuesito] ?? 0),
                        comentario: comentarios[quesito.idQuesito] ?? "",
                        subQuesitos: quesito.subQuesitos?.map((sub) => ({
                            subQuesitoId: Number(sub.idSubequestios),
                            notaSubQuesito: Number(notas[sub.idSubequestios] ?? 0),
                        })) ?? [],
                    })),
                    ficha: {
                        idFicha: Number(ficha.idFicha),
                        concursoId: Number(ficha.concursoId),
                        notaFinalProvaTeorica: Number(ficha.notaFinalProvaTeorica ?? 0),
                        // AQUI ESTÁ A CORREÇÃO:
                        anexoGabarito: typeof ficha.anexoGabarito === 'string' ? ficha.anexoGabarito : (ficha.anexoGabarito?.name || ""),
                        anexoRedacao: typeof ficha.anexoRedacao === 'string' ? ficha.anexoRedacao : (ficha.anexoRedacao?.name || ""),
                    },
                };

                console.log("Payload para atualização:", payload);

                // ⚠️ Envia a requisição de PUT para o Back-end
                await atualizarAvaliacaoTeorica(idAvaliacaoSalva, payload);
                editouAlgum = true;
            }

            if (editouAlgum) {
                resetPagina();
                toast.success("Avaliação teórica editada com sucesso!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao editar avaliação teórica");
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-neutral-background">
            <SideNavBar />
            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col min-h-[600px]">

                    {/* CABEÇALHO */}
                    <div className="p-6 border-b border-outline-variant bg-red-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-xl text-red-600 shadow-sm">
                                <BookOpenCheck size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-red-700 flex items-center gap-2">
                                    Edição da Prova Teórica <ShieldAlert size={18} />
                                </h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">
                                    Área restrita (Admin). Altere as notas da prova escrita e redação.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                        {/* FILTROS */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-2">
                                        <Filter size={16} className="text-primary" /> Categoria
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

                            <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-2">
                                        <User size={16} className="text-primary" /> Candidato
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
                                        Selecione um candidato acima para editar a avaliação.
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-fadeIn">
                                    {/* MANTENHA AQUI O COMPONENTE DE EDIÇÃO QUE CRIAMOS NA RESPOSTA ANTERIOR */}
                                    <EdicaoAvaliacaoTeoricaAccordion
                                        provas={provasSelecionadas}
                                        notas={notas}
                                        comentarios={comentarios}
                                        onChangeNota={(id, nota) => setNotas((prev) => ({ ...prev, [id]: nota }))}
                                        onChangeComentario={(id, comentario) =>
                                            setComentarios((prev) => ({ ...prev, [id]: comentario }))
                                        }
                                        onSalvar={handleSalvarEdicao}
                                        onChangeAnexoGabarito={(file) => {
                                            if (file) setFicha((prev) => prev ? { ...prev, anexoGabarito: file.name } : prev);
                                        }}
                                        onChangeAnexoRedacao={(file) => {
                                            if (file) setFicha((prev) => prev ? { ...prev, anexoRedacao: file.name } : prev);
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