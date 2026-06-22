import { useEffect, useState, useRef } from "react";
import RelatorioGeralList from "../components/Lists/RelatorioGeralList";
import RankingCategoriaList from "../components/Lists/RankingCategoriaList";
import SideNavBar from "../components/SideNavBar/SideNavBar";
import ReportHeader from "../components/PDFModelo/timbradoSisConPP";
import RelatorioIndividualDetalhado from "../components/Relatorios/RelatorioIndividual";
import RelatorioCategoriaTabela from "../components/Relatorios/RelatorioCategoriaTabela";
import { listarConcurso, listarCategorias, listarCandidatos } from "../services/api";
import { Concurso } from "../types/Concurso";
import { Categoria } from "../types/Categoria";
import { Candidato } from "../types/Candidato";
import { toast } from "react-toastify";
import { FileText, Trophy, Printer, User, Filter, FileBarChart2, LayoutList } from "lucide-react";

type TabOption = 'GERAL' | 'RANKING' | 'INDIVIDUAL' | 'DETALHADO';

export default function Relatorios() {

    const [concursos, setConcursos] = useState<Concurso[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [activeTab, setActiveTab] = useState<TabOption>('GERAL');

    const [concursoGeralId, setConcursoGeralId] = useState<number | null>(null);
    
    const [concursoRankingId, setConcursoRankingId] = useState<number | null>(null);
    const [categoriaRankingId, setCategoriaRankingId] = useState<number | null>(null);
    
    const [candidatoIndividualId, setCandidatoIndividualId] = useState<number | null>(null);
    const [categoriaIndividualId, setCategoriaIndividualId] = useState<number | null>(null);
    
    const [concursoDetalhadoId, setConcursoDetalhadoId] = useState<number | null>(null);
    const [categoriaDetalhadaId, setCategoriaDetalhadaId] = useState<number | null>(null);


    const componentRef = useRef(null);

    const selectClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";
    const tabClass = (isActive: boolean) => `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-primary text-primary' : 'border-transparent text-neutral-onSurface opacity-60 hover:opacity-100 hover:border-outline-variant'}`;

    const usuarioLogado = (() => {
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            return usuario.nome || "Usuário";
        } catch {
            return "Usuário";
        }
    })();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [concursosData, categoriasData, candidatosData] = await Promise.all([
                    listarConcurso(),
                    listarCategorias(),
                    listarCandidatos()
                ]);
                setConcursos(concursosData as Concurso[]);
                setCategorias(categoriasData as Categoria[]);
                setCandidatos(candidatosData as Candidato[]);
            } catch {
                toast.error("Erro ao carregar dados do sistema.");
            }
        };
        loadData();
    }, []);

    const getNomeConcurso = (id: number | null) => concursos.find(c => c.idConcurso === id)?.nomeConcurso || "";
    const getNomeCategoria = (id: number | null) => categorias.find(c => c.idCategoria === id)?.nomeCategoria || "";

    const handlePrint = () => {
        window.print();
    };

    const renderFilters = () => {
        switch (activeTab) {
            case 'GERAL':
                return (
                    <div className="w-full md:w-1/2">
                        <label className={labelClass}>Selecione o Concurso</label>
                        <select className={selectClass} value={concursoGeralId ?? ""} onChange={(e) => setConcursoGeralId(Number(e.target.value) || null)}>
                            <option value="">Selecione...</option>
                            {concursos.map(c => <option key={c.idConcurso} value={c.idConcurso}>{c.nomeConcurso}</option>)}
                        </select>
                    </div>
                );
            case 'RANKING':
                return (
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label className={labelClass}>Concurso</label>
                            <select className={selectClass} value={concursoRankingId ?? ""} onChange={(e) => setConcursoRankingId(Number(e.target.value) || null)}>
                                <option value="">Selecione...</option>
                                {concursos.map(c => <option key={c.idConcurso} value={c.idConcurso}>{c.nomeConcurso}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Categoria</label>
                            <select className={selectClass} value={categoriaRankingId ?? ""} onChange={(e) => setCategoriaRankingId(Number(e.target.value) || null)} disabled={!concursoRankingId}>
                                <option value="">Selecione...</option>
                                {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nomeCategoria}</option>)}
                            </select>
                        </div>
                    </div>
                );
            case 'INDIVIDUAL':
                return (
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label className={labelClass}>Categoria</label>
                            <select 
                                className={selectClass} 
                                value={categoriaIndividualId ?? ""} 
                                onChange={(e) => {
                                    setCategoriaIndividualId(Number(e.target.value) || null);
                                    setCandidatoIndividualId(null);
                                }}
                            >
                                <option value="">Selecione...</option>
                                {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nomeCategoria}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Candidato</label>
                            <select 
                                className={selectClass} 
                                value={candidatoIndividualId ?? ""} 
                                onChange={(e) => setCandidatoIndividualId(Number(e.target.value) || null)}
                                disabled={!categoriaIndividualId}
                            >
                                <option value="">Selecione...</option>
                                {candidatos
                                    .filter(c => categoriaIndividualId ? c.categoriaId === categoriaIndividualId : true)
                                    .map(c => <option key={c.idCandidato} value={c.idCandidato}>{c.nomeCompleto}</option>)
                                }
                            </select>
                        </div>
                    </div>
                );
            case 'DETALHADO':
                return (
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label className={labelClass}>Concurso</label>
                            <select className={selectClass} value={concursoDetalhadoId ?? ""} onChange={(e) => setConcursoDetalhadoId(Number(e.target.value) || null)}>
                                <option value="">Selecione...</option>
                                {concursos.map(c => <option key={c.idConcurso} value={c.idConcurso}>{c.nomeConcurso}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Categoria</label>
                            <select className={selectClass} value={categoriaDetalhadaId ?? ""} onChange={(e) => setCategoriaDetalhadaId(Number(e.target.value) || null)} disabled={!concursoDetalhadoId}>
                                <option value="">Selecione...</option>
                                {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nomeCategoria}</option>)}
                            </select>
                        </div>
                    </div>
                );
        }
    };

    const renderContent = () => {
        let showContent = false;
        let title = "";
        let subtitle = "";
        let ContentComponent = null;

        if (activeTab === 'GERAL' && concursoGeralId) {
            showContent = true;
            title = "Relatório Geral";
            subtitle = getNomeConcurso(concursoGeralId);
            ContentComponent = <RelatorioGeralList concursoId={concursoGeralId} />;
        } else if (activeTab === 'RANKING' && concursoRankingId && categoriaRankingId) {
            showContent = true;
            title = "Resultado por Categoria Oficial";
            subtitle = `${getNomeConcurso(concursoRankingId)} - ${getNomeCategoria(categoriaRankingId)}`;
            ContentComponent = <RankingCategoriaList concursoId={concursoRankingId} categoriaId={categoriaRankingId} />;
        } else if (activeTab === 'INDIVIDUAL' && candidatoIndividualId) {
            showContent = true;
            title = "Relatório Individual do Candidato";
            subtitle = getNomeCategoria(categoriaIndividualId);
            ContentComponent = <RelatorioIndividualDetalhado candidatoId={candidatoIndividualId} />;
        } else if (activeTab === 'DETALHADO' && concursoDetalhadoId && categoriaDetalhadaId) {
            showContent = true;
            title = "Relatório Detalhado da Categoria";
            subtitle = getNomeCategoria(categoriaDetalhadaId);
            ContentComponent = <RelatorioCategoriaTabela categoriaId={categoriaDetalhadaId} concursoIdConcurso={concursoDetalhadoId} />;
        }

        if (!showContent) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-onSurface opacity-40 border-2 border-dashed border-outline-variant rounded-xl mt-6">
                    <Filter size={48} className="mb-4" />
                    <p className="text-lg font-medium">Selecione os filtros acima para gerar o relatório.</p>
                </div>
            );
        }

        return (
            <div ref={componentRef} className="mt-6 bg-white p-6 rounded-xl border border-outline-variant shadow-sm print:border-none print:shadow-none print:p-0">
                <ReportHeader title={title} subtitle={subtitle} user={usuarioLogado} />
                <div className="mt-6">
                    {ContentComponent}
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen w-full bg-neutral-background">
            <div className="print:hidden">
                <SideNavBar />
            </div>

            <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto  print:p-0 print:overflow-visible print:bg-white">
                
                {/* CARD UNIFICADO */}
                <div className="w-full bg-surface-containerLowest rounded-2xl shadow-sm border border-outline-variant flex flex-col min-h-[600px] print:border-none print:shadow-none">
                    
                    {/* CABEÇALHO GERAL (Não impresso) */}
                    <div className="p-6 border-b border-outline-variant print:hidden">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-container rounded-xl text-primary-onContainer shadow-sm">
                                    <FileBarChart2 size={24} />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-primary-dark">Central de Relatórios</h1>
                                    <p className="text-sm text-neutral-onSurface opacity-70">
                                        Gere, visualize e imprima os resultados do concurso.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Botão de Impressão Global (aparece se houver conteúdo) */}
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 font-bold"
                            >
                                <Printer size={20} />
                                Imprimir
                            </button>
                        </div>

                        {/* TAB NAVIGATION */}
                        <div className="flex gap-1 mt-8 overflow-x-auto">
                            <button onClick={() => setActiveTab('GERAL')} className={tabClass(activeTab === 'GERAL')}>
                                <FileText size={18} /> Geral
                            </button>
                            <button onClick={() => setActiveTab('RANKING')} className={tabClass(activeTab === 'RANKING')}>
                                <Trophy size={18} /> Ranking
                            </button>
                            <button onClick={() => setActiveTab('INDIVIDUAL')} className={tabClass(activeTab === 'INDIVIDUAL')}>
                                <User size={18} /> Individual
                            </button>
                            <button onClick={() => setActiveTab('DETALHADO')} className={tabClass(activeTab === 'DETALHADO')}>
                                <LayoutList size={18} /> Detalhado
                            </button>
                        </div>
                    </div>

                    {/* ÁREA DE CONTEÚDO */}
                    <div className="p-6 md:p-8 flex-1 bg-neutral-50/50 print:bg-white print:p-0">
                        
                        {/* Filtros (Ocultos na impressão) */}
                        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm mb-6 print:hidden">
                            <h3 className="text-sm font-bold text-neutral-onSurface uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Filter size={16} /> Filtros do Relatório
                            </h3>
                            {renderFilters()}
                        </div>

                        {/* Relatório Gerado */}
                        <div className="animate-fadeIn">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}