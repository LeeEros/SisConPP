import { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import {
    listarCandidatos,
    listarCategorias,
    getDancasTradicionais,
    getDancasSalao,
    criarPreferencia,
} from "../services/api";
import { DancaSalaoTradicional, Danca } from "../types/SorteioDanca";
import { Candidato } from "../types/Candidato";
import { Categoria } from "../types/Categoria";
import DancaForm from "../components/Forms/DancaForm";
import DancaList from "../components/Lists/DancaList";
import Modal from "../components/Modal/Modal";
import { toast } from "react-toastify";
import RoletaSorteio from "../components/Roleta/RoletaSorteio";
import { Dices, Save, CheckCircle, RotateCcw, Trophy, XCircle } from "lucide-react";

export default function SorteioDancas() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [dancas, setDancas] = useState<Danca[]>([]);
    const [tipoDanca, setTipoDanca] = useState<DancaSalaoTradicional | null>(null);
    const [selecionados, setSelecionados] = useState<number[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
    const [candidatoSelecionado, setCandidatoSelecionado] = useState<number | null>(null);
    const [preferenciasSalvas, setPreferenciasSalvas] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [resultadoFinal, setResultadoFinal] = useState<Danca | null>(null);

    const candidatosFiltrados = categoriaSelecionada
        ? candidatos.filter((c) => c.categoriaId === categoriaSelecionada)
        : candidatos;

    const categoriaAtual = categorias.find((c) => c.idCategoria === categoriaSelecionada);
    const maxSelecionados = categoriaAtual?.sorteioDanca ?? null;
    const naoTemSorteio = categoriaAtual?.sorteioDanca === 1;

    useEffect(() => {
        listarCandidatos().then((res) => setCandidatos(res as Candidato[]));
        listarCategorias().then((res) => setCategorias(res as Categoria[]));
    }, []);

    const buscarDancas = async (tipo: DancaSalaoTradicional) => {
        setTipoDanca(tipo);
        const dancasEncontradas =
            tipo === DancaSalaoTradicional.DANCA_TRADICIONAL
                ? await getDancasTradicionais()
                : await getDancasSalao();
        setDancas(dancasEncontradas);
    };

    const toggleSelecionado = (id: number) => {
        setSelecionados((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const salvarPreferencias = async () => {
        if (!candidatoSelecionado || !tipoDanca) {
            toast.error("Selecione candidato e tipo de dança antes de salvar.");
            return;
        }

        const preferencias = {
            nomeSorteioDanca: tipoDanca,
            candidatoId: candidatoSelecionado,
            dancas: selecionados,
        };

        try {
            await criarPreferencia(preferencias);

            if (naoTemSorteio) {
                toast.success("Preferência salva com sucesso!");
                setIsDialogOpen(false);
                setSelecionados([]);
                setDancas([]);
                setTipoDanca(null);
                return;
            }

            toast.success("Preferências salvas! Iniciando sorteio...");
            setPreferenciasSalvas(true);
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar preferências.");
        }
    };

    const resetSorteio = () => {
        setPreferenciasSalvas(false);
        setResultadoFinal(null);
        setSelecionados([]);
    };

    return (
        <div className="flex flex-row min-h-screen w-full bg-neutral-background">
            <SideNavBar />

            <main className="flex-1 p-6 md:p-8 pt-16 md:pt-8 overflow-y-auto">
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col min-h-[600px]">
                    <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                <Dices size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-dark">Sorteio de Danças</h1>
                                <p className="text-sm text-neutral-onSurface opacity-70">
                                    {preferenciasSalvas
                                        ? "Sorteio em andamento..."
                                        : naoTemSorteio
                                            ? "Selecione e salve a preferência (sem sorteio nesta categoria)"
                                            : "Configure as opções e realize o sorteio"}
                                </p>
                            </div>
                        </div>

                        {preferenciasSalvas && (
                            <button
                                onClick={resetSorteio}
                                className="flex items-center gap-2 text-sm font-medium text-neutral-onSurface hover:text-primary transition-colors bg-surface-containerHigh px-4 py-2 rounded-lg border border-outline-variant"
                            >
                                <RotateCcw size={16} /> Reiniciar
                            </button>
                        )}
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                        {!preferenciasSalvas ? (
                            <div className="flex flex-col h-full space-y-8 animate-fadeIn">
                                <div className="space-y-6">
                                    <DancaForm
                                        categorias={categorias}
                                        candidatos={candidatosFiltrados}
                                        categoriaSelecionada={categoriaSelecionada}
                                        setCategoriaSelecionada={setCategoriaSelecionada}
                                        candidatoSelecionado={candidatoSelecionado}
                                        setCandidatoSelecionado={setCandidatoSelecionado}
                                        tipoDanca={tipoDanca}
                                        setTipoDanca={setTipoDanca}
                                        buscarDancas={buscarDancas}
                                    />
                                </div>

                                {dancas.length > 0 && (
                                    <div className="border-t border-outline-variant pt-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-neutral-onSurface">
                                                Selecione as danças
                                            </h3>
                                            <span
                                                className={`text-sm font-medium px-3 py-1 rounded-full ${selecionados.length === maxSelecionados
                                                        ? "bg-primary-container text-primary-onContainer"
                                                        : "bg-surface-variant text-neutral-onVariant"
                                                    }`}
                                            >
                                                {selecionados.length} / {maxSelecionados || "?"} selecionadas
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <DancaList
                                                dancas={dancas}
                                                selecionados={selecionados}
                                                toggleSelecionado={toggleSelecionado}
                                                maxSelecionados={maxSelecionados}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto pt-6 border-t border-outline-variant flex justify-end">
                                    <button
                                        onClick={() => setIsDialogOpen(true)}
                                        disabled={selecionados.length === 0 || !candidatoSelecionado}
                                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl shadow-lg shadow-primary/20 font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                    >
                                        <Save size={20} />
                                        {naoTemSorteio ? "Confirmar Preferência" : "Confirmar e Sortear"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn min-h-[400px]">
                                {candidatoSelecionado && tipoDanca && (
                                    <div className="w-full max-w-2xl">
                                        <RoletaSorteio
                                            candidatoId={candidatoSelecionado}
                                            usuarioId={usuarioLogado.idUsuario}
                                            tipoDanca={tipoDanca}
                                            dancas={dancas.filter((d) => selecionados.includes(d.idDanca))}
                                            onFinish={(resultado) => {
                                                setResultadoFinal(resultado);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Modal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <div className="p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-14 h-14 bg-primary-container text-primary rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-onBackground">
                            {naoTemSorteio ? "Confirmar Preferência" : "Confirmar Sorteio"}
                        </h2>
                        <p className="text-sm text-neutral-onSurface opacity-70 mt-2 max-w-xs mx-auto">
                            Você selecionou <strong>{selecionados.length}</strong> danças.{" "}
                            {naoTemSorteio ? "Deseja salvar a preferência?" : "Tudo pronto para começar?"}
                        </p>
                    </div>

                    <div className="bg-surface-containerHigh p-4 rounded-xl mb-8 border border-outline-variant">
                        <ul className="space-y-2">
                            {dancas
                                .filter((d) => selecionados.includes(d.idDanca))
                                .map((d) => (
                                    <li
                                        key={d.idDanca}
                                        className="text-sm font-medium text-neutral-onSurface flex items-center gap-3 p-2 rounded-lg bg-surface-containerLowest border border-outline/50"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-1"></span>
                                        {d.nomeDanca}
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-neutral-onSurface hover:bg-surface-variant transition font-medium"
                        >
                            <XCircle size={18} /> Cancelar
                        </button>
                        <button
                            onClick={salvarPreferencias}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md transition font-bold"
                        >
                            {naoTemSorteio ? <Save size={18} /> : <Dices size={18} />}
                            {naoTemSorteio ? "Salvar" : "Iniciar"}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!resultadoFinal}
                onClose={() => {
                    setResultadoFinal(null);
                    window.location.reload();
                }}
            >
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl">
                    <div className="mb-6 p-4 bg-primary-container/30 rounded-full text-primary-dark animate-bounce">
                        <Trophy size={48} strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl font-bold text-neutral-800 mb-1">Dança Sorteada!</h2>
                    <p className="text-neutral-500 text-sm mb-8">O resultado foi registrado com sucesso.</p>

                    {resultadoFinal && (
                        <div className="w-full py-6 px-4 bg-neutral-50 border border-neutral-200 border-dashed rounded-xl mb-8">
                            <p className="text-2xl md:text-3xl font-black text-primary-dark tracking-wide uppercase break-words">
                                {resultadoFinal.nomeDanca}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setResultadoFinal(null);
                            window.location.reload();
                        }}
                        className="w-full px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
                    >
                        Confirmar e Concluir
                    </button>
                </div>
            </Modal>
        </div>
    );
}