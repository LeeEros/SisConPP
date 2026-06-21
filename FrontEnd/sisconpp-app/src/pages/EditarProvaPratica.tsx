import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import { Candidato, FichaCandidatoProvaPratica } from "../types/Candidato";
import { UsuarioAvaliador } from "../types/Usuario";
import { ProvaAccordionDTO } from "../types/Avaliacao";
import { Categoria } from "../types/Categoria";
import {
    listarCandidatos,
    listarUsuriosAvaliadores,
    listarCategorias,
    buscarFichaCandidatoPorId,
    buscarEstruturaAvaliacao, // <-- Adicionamos isso de volta!
    buscarAvaliaçãoCompletasPorCandidatoAvaliador,
    atualizarAvaliacaoCompleta
} from "../services/api";
import { toast } from "react-toastify";
import EdicaoAvaliacaoAccordion from "../components/EdiçãoProvaPratica/EdicaoAvaliacaoAccordion";
import { ClipboardEdit, Filter, User, Users, ShieldAlert } from "lucide-react";

export default function EdicaoAvaliacaoPage() {
    const navigate = useNavigate();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");

    const [candidatoSelecionado, setCandidatoSelecionado] = useState<number | null>(null);
    const [avaliadorSelecionado, setAvaliadorSelecionado] = useState<number | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
    
    // NOVO: Um mapa para guardar qual é o idAvalicao de cada bloco
    const [mapaIdsAvaliacao, setMapaIdsAvaliacao] = useState<Record<number, number>>({});

    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [avaliadores, setAvaliadores] = useState<UsuarioAvaliador[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [provasSelecionadas, setProvasSelecionadas] = useState<ProvaAccordionDTO[]>([]);
    const [notas, setNotas] = useState<Record<number, number>>({});
    const [comentarios, setComentarios] = useState<Record<number, string>>({});
    const [ficha, setFicha] = useState<FichaCandidatoProvaPratica | null>(null);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmName, setConfirmName] = useState("");

    const selectClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";

    useEffect(() => {
        if (!usuarioLogado || usuarioLogado.funcao !== "ADMINISTRADOR") {
            toast.error("Acesso restrito. Apenas administradores podem editar notas.");
            navigate("/");
        }
    }, [usuarioLogado, navigate]);

    useEffect(() => {
        listarCandidatos().then(res => setCandidatos(res as Candidato[])).catch(() => toast.error("Erro ao carregar candidatos"));
        listarCategorias().then(res => setCategorias(res as Categoria[])).catch(() => toast.error("Erro ao carregar categorias"));
        listarUsuriosAvaliadores().then(res => setAvaliadores(res as UsuarioAvaliador[])).catch(() => toast.error("Erro ao carregar avaliadores"));
    }, []);

    useEffect(() => {
        if (!candidatoSelecionado) {
            setFicha(null);
            return;
        }
        buscarFichaCandidatoPorId(Number(candidatoSelecionado))
            .then(res => setFicha(res as FichaCandidatoProvaPratica))
            .catch(() => toast.error("Erro ao carregar ficha do candidato"));
    }, [candidatoSelecionado]);

    // O GRANDE SEGREDO ESTÁ AQUI
    useEffect(() => {
        const fetchAvaliacaoExistente = async () => {
            if (!candidatoSelecionado || !avaliadorSelecionado) {
                setProvasSelecionadas([]);
                setNotas({});
                setComentarios({});
                setMapaIdsAvaliacao({});
                return;
            }

            try {
                // 1. Busca a ESTRUTURA vazia (para desenhar a tela com os nomes e notas máximas)
                const estrutura = await buscarEstruturaAvaliacao(avaliadorSelecionado, candidatoSelecionado);
                const provaArr = Array.isArray(estrutura) ? estrutura : [estrutura];
                setProvasSelecionadas(provaArr as ProvaAccordionDTO[]);

                // 2. Busca as RESPOSTAS (o JSON que você me enviou)
                const respostas = await buscarAvaliaçãoCompletasPorCandidatoAvaliador(candidatoSelecionado, avaliadorSelecionado);

                const notasExistentes: Record<number, number> = {};
                const comentariosExistentes: Record<number, string> = {};
                const mapaDeIds: Record<number, number> = {};

                // 3. Varre o JSON das respostas para extrair os dados usando os campos exatos do back-end
                respostas.forEach((resposta: any) => {
                    // Mapeia o ID do Bloco para o ID da Avaliação (cuidado com o typo idAvalicao da sua API)
                    if (resposta.blocoProvaId && resposta.idAvalicao) {
                        mapaDeIds[resposta.blocoProvaId] = resposta.idAvalicao;
                    }

                    // Extrai os comentários dos quesitos
                    resposta.quesitosAvaliados?.forEach((q: any) => {
                        if (q.comentario) {
                            comentariosExistentes[q.quesitoId] = q.comentario;
                        }

                        // Extrai as notas dos subquesitos
                        q.subQuesitosAvaliados?.forEach((sub: any) => {
                            if (sub.notaSubQuesito !== undefined && sub.notaSubQuesito !== null) {
                                notasExistentes[sub.subQuesitoId] = Number(sub.notaSubQuesito);
                            }
                        });
                    });
                });

                // 4. Joga tudo no state do React para a tela desenhar as notas
                setNotas(notasExistentes);
                setComentarios(comentariosExistentes);
                setMapaIdsAvaliacao(mapaDeIds);

            } catch (error) {
                toast.error("Erro ao carregar os dados desta avaliação.");
                console.error(error);
            }
        };

        fetchAvaliacaoExistente();
    }, [candidatoSelecionado, avaliadorSelecionado]);

    const handleSalvarAvaliacao = () => {
        if (!avaliadorSelecionado || !candidatoSelecionado) {
            toast.error("Selecione candidato e avaliador");
            return;
        }
        setShowConfirmDialog(true);
        setConfirmName("");
    };

    const confirmAndSave = async () => {
        const candidato = candidatos.find(c => c.idCandidato === candidatoSelecionado);
        if (!candidato || confirmName.trim().toLowerCase() !== candidato.nomeCompleto.trim().toLowerCase()) {
            toast.error("Nome do candidato não confere. Verifique a ortografia.");
            return;
        }

        try {
            const avaliador = avaliadores.find(a => a.idUsuario === avaliadorSelecionado);
            const comissaoId = avaliador?.ComissaoUsuario?.comissaoId ?? 0;
            const provaPraticaId = provasSelecionadas[0]?.idProvaPratica ?? 0;

            let editouAlgum = false;

            for (const bloco of provasSelecionadas[0]?.blocosProvas ?? []) {
                // Recupera o ID exato da avaliação que pertence a este bloco
                const idAvalicaoDoBloco = mapaIdsAvaliacao[bloco.idBloco];

                if (!idAvalicaoDoBloco) {
                    continue; // Se por algum motivo o bloco não tinha sido avaliado antes, ele pula
                }

                const payload = {
                    comissaoId,
                    avaliadorId: avaliadorSelecionado,
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

                // Envia o PUT usando o ID correto do bloco
                await atualizarAvaliacaoCompleta(idAvalicaoDoBloco, payload as any);
                editouAlgum = true;
            }

            if (editouAlgum) {
                toast.success("Notas atualizadas com sucesso!");
                setNotas({});
                setComentarios({});
                setCandidatoSelecionado(null);
                setAvaliadorSelecionado(null);
                setProvasSelecionadas([]);
                setFicha(null);
                setMapaIdsAvaliacao({});
                setShowConfirmDialog(false);
            } else {
                toast.warning("Nenhuma avaliação encontrada para atualizar neste candidato.");
            }

        } catch (error) {
            toast.error("Erro ao atualizar avaliações");
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            {showConfirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-surface-containerLowest w-full max-w-md p-6 rounded-2xl shadow-xl border border-outline-variant">
                        <h2 className="text-xl font-bold text-primary-dark mb-4">Confirmar Avaliação</h2>
                        <p className="text-sm text-neutral-onSurface mb-4">
                            Para salvar a avaliação, digite o nome do candidato abaixo para validar:
                            <br />
                            <strong className="text-primary mt-1 inline-block text-base">{candidatos.find(c => c.idCandidato === candidatoSelecionado)?.nomeCompleto}</strong>
                        </p>
                        <input
                            type="text"
                            className={selectClass}
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder="Digite o nome do candidato..."
                            autoFocus
                        />
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowConfirmDialog(false)} className="px-4 py-2 text-sm font-semibold text-neutral-onSurface border border-outline rounded-xl hover:bg-surface-containerHigh transition-colors">
                                Cancelar
                            </button>
                            <button onClick={confirmAndSave} className="px-4 py-2 text-sm font-semibold text-primary-onContainer bg-primary-container rounded-xl hover:opacity-90 transition-colors">
                                Confirmar e Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col min-h-[600px]">

                    <div className="p-6 border-b border-outline-variant bg-red-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-xl text-red-600 shadow-sm">
                                <ClipboardEdit size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-red-700 flex items-center gap-2">
                                    Edição de Notas <ShieldAlert size={18} />
                                </h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">
                                    Área restrita (Admin). Altere as notas e comentários atribuídos anteriormente.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col">

                        <div className="grid gap-6 mb-8 md:grid-cols-3">

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
                                        setNotas({});
                                        setComentarios({});
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

                            <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-2">
                                        <ShieldAlert size={16} className="text-primary" /> Avaliador Responsável
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
                        </div>

                        <div className="flex-1">
                            {!candidatoSelecionado || !avaliadorSelecionado ? (
                                <div className="text-center py-20 border-2 border-dashed border-outline-variant rounded-xl bg-surface-containerHigh/30">
                                    <Users className="mx-auto h-12 w-12 text-neutral-onSurface opacity-20 mb-4" />
                                    <p className="text-lg font-semibold text-neutral-onSurface opacity-60">
                                        Aguardando Seleção
                                    </p>
                                    <p className="text-sm text-neutral-onSurface opacity-40">
                                        Selecione um candidato e um avaliador para editar as notas.
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-fadeIn">
                                    <EdicaoAvaliacaoAccordion
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