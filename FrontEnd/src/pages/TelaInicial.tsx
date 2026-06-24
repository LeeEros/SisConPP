import React from 'react';

import { useState, useEffect } from 'react';
import {
  Users,
  ClipboardList,
  Trophy,
  PlusCircle,
  FileText,
  Shuffle,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import SideNavBar from '../components/SideNavBar/SideNavBar';
import { listarCandidatos, listarConcurso, listarAvaliacoes } from '../services/api';


function Dashboard() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");

  useEffect(() => {
    if (usuarioLogado?.nome) {
      setNomeUsuario(usuarioLogado.nome);
    }
  }, [usuarioLogado]);

  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  const [totalCandidatos, setTotalCandidatos] = useState(0);
  const [totalConcursos, setTotalConcursos] = useState(0);

  useEffect(() => {
    if (usuarioLogado?.nome) {
      setNomeUsuario(usuarioLogado.nome);
    }
  }, [usuarioLogado]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidatos = await listarCandidatos();
        setTotalCandidatos(candidatos.length);

        const concursos = await listarConcurso();
        setTotalConcursos(concursos.length);

        const avaliacoes = await listarAvaliacoes();
        setTotalAvaliacoes(avaliacoes.length);
      } catch (error) {
        console.error("Erro ao carregar dados da Dashboard", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-background text-neutral-onBackground">
      <SideNavBar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">

        {/* 1. Cabeçalho */}
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">Dashboard</h1>
            <p className="text-neutral-onSurface opacity-70">
              Seja bem-vindo(a), <span className="font-semibold text-primary-dark">{nomeUsuario}</span>! 👋
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium bg-surface-containerHigh px-4 py-2 rounded-full shadow-sm text-surface-onVariant">
            <CalendarDays size={18} className="text-primary" />
            {new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}
          </div>
        </div>

        {/* 2. KPIs (Indicadores) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Card Inscritos */}
          <div className="bg-surface-containerLowest p-6 rounded-2xl shadow-sm border border-outline-variant flex items-center justify-between hover:border-primary transition-colors">
            <div>
              <p className="text-neutral-onSurface text-sm font-medium opacity-80">Inscritos</p>
              <h3 className="text-4xl font-bold text-primary mt-1">{totalCandidatos}</h3>
            </div>
            <div className="p-4 bg-primary-container rounded-2xl text-primary-onContainer">
              <Users size={28} />
            </div>
          </div>

          {/* Card Avaliações */}
          <div className="bg-surface-containerLowest p-6 rounded-2xl shadow-sm border border-outline-variant flex items-center justify-between hover:border-secondary transition-colors">
            <div>
              <p className="text-neutral-onSurface text-sm font-medium opacity-80">Avaliações</p>
              <h3 className="text-4xl font-bold text-secondary mt-1">{totalAvaliacoes}</h3>
            </div>
            <div className="p-4 bg-secondary-container rounded-2xl text-secondary-onContainer">
              <ClipboardList size={28} />
            </div>
          </div>

          {/* Card Concursos */}
          <div className="bg-surface-containerLowest p-6 rounded-2xl shadow-sm border border-outline-variant flex items-center justify-between hover:border-tertiary transition-colors">
            <div>
              <p className="text-neutral-onSurface text-sm font-medium opacity-80">Concursos</p>
              <h3 className="text-4xl font-bold text-tertiary-dark mt-1">{totalConcursos}</h3>
            </div>
            <div className="p-4 bg-tertiary-container rounded-2xl text-tertiary-onContainer">
              <Trophy size={28} />
            </div>
          </div>
        </div>

        {/* 3. Área Principal: Ações e Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Coluna Esquerda: Ações Rápidas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-containerLowest p-6 rounded-2xl shadow-sm border border-outline-variant">
              <h2 className="text-xl font-bold text-neutral-onSurface mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Acesso Rápido
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Botão Nova Avaliação */}
                <a href="/avaliacao-pratica" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary-container/20 transition-all group bg-surface-bright text-left">
                  <div className="p-3 bg-primary-fixedDim rounded-full text-primary-onFixed group-hover:bg-primary group-hover:text-primary-on transition-colors">
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-neutral-onSurface group-hover:text-primary-dark">Nova Avaliação</span>
                    <span className="text-xs text-neutral-onVariant">Lançar nota prática ou teórica</span>
                  </div>
                </a>

                {/* Botão Relatórios */}
                <a href="/relatorios" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-secondary hover:bg-secondary-container/20 transition-all group bg-surface-bright text-left ">
                  <div className="p-3 bg-secondary-fixedDim rounded-full text-secondary-onFixed group-hover:bg-secondary group-hover:text-secondary-on transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-neutral-onSurface group-hover:text-secondary-dark">Relatórios</span>
                    <span className="text-xs text-neutral-onVariant">Ver resultados parciais</span>
                  </div>
                </a>

                {/* Botão Sorteio */}
                <a href="/sorteio-danca" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-tertiary hover:bg-tertiary-container/20 transition-all group bg-surface-bright text-left">
                  <div className="p-3 bg-tertiary-fixedDim rounded-full text-tertiary-onFixed group-hover:bg-tertiary group-hover:text-tertiary-on transition-colors">
                    <Shuffle size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-neutral-onSurface group-hover:text-tertiary-dark">Sorteio de Danças</span>
                    <span className="text-xs text-neutral-onVariant">Sortear para concurso atual</span>
                  </div>
                </a>

                {/* Botão Candidatos */}
                <a href="/candidatos" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-outline hover:bg-surface-variant transition-all group bg-surface-bright text-left">
                  <div className="p-3 bg-surface-variant rounded-full text-surface-onVariant group-hover:bg-outline group-hover:text-surface-containerLowest transition-colors">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-neutral-onSurface">Candidatos</span>
                    <span className="text-xs text-neutral-onVariant">Gerenciar inscrições</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Gráfico */}
          {/* <div className="bg-surface-containerLowest p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col">
            <h2 className="text-xl font-bold text-neutral-onSurface mb-2">Progresso</h2>
            <p className="text-sm text-neutral-onVariant mb-6">Porcentagem avaliada por categoria</p>

            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E2DF" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 11, fill: '#454841', fontWeight: 500 }}
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#30302F', // Inverse Surface
                      color: '#F3F0ED', // Inverse On Surface
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: '#F3F0ED' }}
                  />
                  <Bar dataKey="progresso" radius={[0, 4, 4, 0]} barSize={24}>
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div> */}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;