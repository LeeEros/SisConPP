import React from 'react';
import { Categoria } from "../../types/Categoria";
import { Candidato } from "../../types/Candidato";
import { DancaSalaoTradicional } from "../../types/SorteioDanca";
import { Music, Users, CheckCircle2, User, Trophy } from "lucide-react";

interface DancaFormProps {
    categorias: Categoria[];
    candidatos: Candidato[];
    categoriaSelecionada: number | null;
    setCategoriaSelecionada: (id: number) => void;
    candidatoSelecionado: number | null;
    setCandidatoSelecionado: (id: number) => void;
    tipoDanca: DancaSalaoTradicional | null;
    setTipoDanca: (tipo: DancaSalaoTradicional) => void;
    buscarDancas: (tipo: DancaSalaoTradicional) => void;
}

export default function DancaForm({
    categorias,
    candidatos,
    categoriaSelecionada,
    setCategoriaSelecionada,
    candidatoSelecionado,
    setCandidatoSelecionado,
    tipoDanca,
    setTipoDanca,
    buscarDancas
}: DancaFormProps) {

    // Função para tratar a seleção e já buscar os dados
    const handleTipoChange = (tipo: DancaSalaoTradicional) => {
        setTipoDanca(tipo);
        buscarDancas(tipo);
    };

    // Estilos reutilizáveis
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-2";
    const selectWrapperClass = "relative";
    const selectClass = "w-full appearance-none rounded-xl border border-outline bg-surface-containerHigh p-3 pl-10 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const iconClass = "absolute left-3 top-3.5 text-neutral-onSurface opacity-50 pointer-events-none";

    return (
        <div className="space-y-8">
            
            {/* Bloco 1: Seleção de Candidato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Select Categoria */}
                <div>
                    <label className={labelClass}>Filtre por Categoria</label>
                    <div className={selectWrapperClass}>
                        <Trophy size={18} className={iconClass} />
                        <select 
                            className={selectClass}
                            value={categoriaSelecionada || ""}
                            onChange={(e) => setCategoriaSelecionada(Number(e.target.value))}
                        >
                            <option value="">Todas as Categorias</option>
                            {categorias.map((cat) => (
                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.nomeCategoria}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Select Candidato */}
                <div>
                    <label className={labelClass}>Selecione o Candidato</label>
                    <div className={selectWrapperClass}>
                        <User size={18} className={iconClass} />
                        <select 
                            className={selectClass}
                            value={candidatoSelecionado || ""}
                            onChange={(e) => setCandidatoSelecionado(Number(e.target.value))}
                            disabled={candidatos.length === 0}
                        >
                            <option value="">
                                {candidatos.length === 0 ? "Nenhum candidato nesta categoria" : "Selecione o Candidato..."}
                            </option>
                            {candidatos.map((cand) => (
                                <option key={cand.idCandidato} value={cand.idCandidato}>
                                    {cand.nomeCompleto}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Bloco 2: Tipo de Dança (Cards Visuais em vez de Radio Buttons) */}
            <div>
                <label className={labelClass}>Qual tipo de dança será sorteada?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Card Tradicional */}
                    <button
                        type="button"
                        onClick={() => handleTipoChange(DancaSalaoTradicional.DANCA_TRADICIONAL)}
                        className={`
                            relative flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 group
                            ${tipoDanca === DancaSalaoTradicional.DANCA_TRADICIONAL 
                                ? 'bg-primary-container/30 border-primary shadow-md' 
                                : 'bg-surface-containerHigh border-transparent hover:bg-surface-container hover:border-outline-variant'
                            }
                        `}
                    >
                        <div className={`
                            p-3 rounded-full mr-4 transition-colors
                            ${tipoDanca === DancaSalaoTradicional.DANCA_TRADICIONAL 
                                ? 'bg-primary text-white' 
                                : 'bg-surface-variant text-neutral-onSurface group-hover:bg-neutral-200'}
                        `}>
                            <Users size={24} />
                        </div>
                        <div className="flex-1">
                            <span className={`block font-bold text-base ${tipoDanca === DancaSalaoTradicional.DANCA_TRADICIONAL ? 'text-primary-dark' : 'text-neutral-onSurface'}`}>
                                Danças Tradicionais
                            </span>
                            <span className="text-xs text-neutral-onSurface opacity-60">
                                Ex: Pezinho, Maçanico, Balaio...
                            </span>
                        </div>
                        {tipoDanca === DancaSalaoTradicional.DANCA_TRADICIONAL && (
                            <CheckCircle2 className="text-primary animate-scaleIn" size={24} />
                        )}
                    </button>

                    {/* Card Salão */}
                    <button
                        type="button"
                        onClick={() => handleTipoChange(DancaSalaoTradicional.DANCA_DE_SALAO)}
                        className={`
                            relative flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 group
                            ${tipoDanca === DancaSalaoTradicional.DANCA_DE_SALAO 
                                ? 'bg-secondary-container/30 border-secondary shadow-md' 
                                : 'bg-surface-containerHigh border-transparent hover:bg-surface-container hover:border-outline-variant'
                            }
                        `}
                    >
                        <div className={`
                            p-3 rounded-full mr-4 transition-colors
                            ${tipoDanca === DancaSalaoTradicional.DANCA_DE_SALAO
                                ? 'bg-secondary text-white' 
                                : 'bg-surface-variant text-neutral-onSurface group-hover:bg-neutral-200'}
                        `}>
                            <Music size={24} />
                        </div>
                        <div className="flex-1">
                            <span className={`block font-bold text-base ${tipoDanca === DancaSalaoTradicional.DANCA_DE_SALAO ? 'text-secondary-dark' : 'text-neutral-onSurface'}`}>
                                Danças de Salão
                            </span>
                            <span className="text-xs text-neutral-onSurface opacity-60">
                                Ex: Vaneira, Xote, Milonga...
                            </span>
                        </div>
                        {tipoDanca === DancaSalaoTradicional.DANCA_DE_SALAO && (
                            <CheckCircle2 className="text-secondary animate-scaleIn" size={24} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}