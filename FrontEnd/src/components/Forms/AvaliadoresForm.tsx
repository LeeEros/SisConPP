import React, { useState, useEffect } from 'react';
import { Credenciamento, Funcao, Usuario } from '../../types/Usuario';
import { CTG } from '../../types/CTG';
import { toast } from 'react-toastify';
import { cadastrarUsuario, listarCTGs, atualizarUsuario } from '../../services/api';
import { Save, XCircle, User, MapPin, BadgeCheck, Lock } from 'lucide-react';

interface AvaliadorFormProps {
    onClose: () => void;
    avaliadorToEdit?: Usuario;
}

const estados = ['Paraná', 'Santa Catarina', 'Rio Grande do Sul'];

export default function AvaliadoresForm({ onClose, avaliadorToEdit }: AvaliadorFormProps) {
    const [ctgs, setCTGs] = useState<{ id: string; nome: string }[]>([]);

    const [formData, setFormData] = useState<Usuario>({
        idUsuario: 0,
        nomeCompleto: '',
        cidade: '',
        estado: '',
        CTGId: 0,
        numCarteirinha: '',
        login: '',
        senha: '',
        funcao: Funcao.AVALIADOR,
        credenciamento: "" as unknown as Credenciamento,
        numCredenciamento: 0,
        comissaoUsuarioId: 0,
    });

    // Estilos padronizados
    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";
    const sectionTitleClass = "text-lg font-bold text-primary border-b border-outline-variant pb-2 mb-4 mt-6 flex items-center gap-2";

    useEffect(() => {
        const fetchCTGs = async () => {
            try {
                const response = await listarCTGs();
                const mappedCTGs = (response as CTG[]).map(ctg => ({
                    id: ctg.idCTG.toString(),
                    nome: ctg.nomeCTG
                }));
                setCTGs(mappedCTGs);
            } catch (error) {
                console.error('Erro ao buscar CTGs:', error);
            }
        };
        fetchCTGs();
    }, []);

    useEffect(() => {
        if (avaliadorToEdit) {
            setFormData({
                ...avaliadorToEdit,
                funcao: Funcao.AVALIADOR,
                credenciamento: avaliadorToEdit.credenciamento ?? "" as Credenciamento,
            });
        }
    }, [avaliadorToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'CTGId' || name === 'numCredenciamento' ? Number(value) : value,
        }));
    };

    const handleCredenciamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            credenciamento: e.target.value as Credenciamento,
            numCredenciamento: 0, // Reseta ao mudar
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const avaliadorPayload: Usuario = {
                ...formData,
                funcao: Funcao.AVALIADOR,
            };

            if (formData.credenciamento === Credenciamento.CREDENCIADO && !formData.numCredenciamento) {
                toast.error("Informe o número de credenciamento.");
                return;
            }

            // Remove senha se estiver vazia na edição
            if (!formData.senha.trim() && avaliadorToEdit) {
               // A lógica de backend deve tratar isso, ou removemos do payload aqui se necessário
            }

            console.log('Payload enviado:', avaliadorPayload);

            if (formData.idUsuario > 0) {
                await atualizarUsuario(avaliadorPayload);
                toast.success('Avaliador atualizado com sucesso!');
            } else {
                await cadastrarUsuario(avaliadorPayload);
                toast.success('Avaliador cadastrado com sucesso!');
            }
            onClose();
        } catch (error) {
            console.error('Erro ao salvar Avaliador:', error);
            toast.error('Erro ao salvar. Verifique os dados.');
        }
    };

    return (
        <div className="w-full text-neutral-onBackground">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark">
                    {avaliadorToEdit ? 'Editar Avaliador' : 'Novo Avaliador'}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Cadastre os dados pessoais e de acesso do avaliador.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* DADOS PESSOAIS */}
                <div>
                    <h3 className={sectionTitleClass}><User size={18}/> Dados Pessoais</h3>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Nome Completo</label>
                            <input
                                type="text"
                                name="nomeCompleto"
                                value={formData.nomeCompleto}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Ex: João da Silva"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* LOCALIZAÇÃO E VÍNCULO */}
                <div>
                    <h3 className={sectionTitleClass}><MapPin size={18}/> Localização e Vínculo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Cidade</label>
                            <input
                                type="text"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Estado</label>
                            <select name="estado" value={formData.estado} onChange={handleChange} required className={inputClass}>
                                <option value="" disabled>Selecione...</option>
                                {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                            </select>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className={labelClass}>CTG</label>
                            <select name="CTGId" value={formData.CTGId} onChange={handleChange} required className={inputClass}>
                                <option value="">Selecione um CTG...</option>
                                {ctgs.map(ctg => <option key={ctg.id} value={ctg.id}>{ctg.nome}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Nº Carteirinha MTG</label>
                            <input
                                type="text"
                                name="numCarteirinha"
                                value={formData.numCarteirinha}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* CREDENCIAMENTO */}
                <div>
                    <h3 className={sectionTitleClass}><BadgeCheck size={18}/> Credenciamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Situação</label>
                            <select
                                name="credenciamento"
                                value={formData.credenciamento as string || ""}
                                onChange={handleCredenciamentoChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Selecione...</option>
                                <option value={Credenciamento.CREDENCIADO}>Credenciado</option>
                                <option value={Credenciamento.NAO_CREDENCIADO}>Não Credenciado</option>
                            </select>
                        </div>

                        {formData.credenciamento === Credenciamento.CREDENCIADO && (
                            <div className="animate-fadeIn">
                                <label className={labelClass}>Número do Credenciamento</label>
                                <input
                                    type="number"
                                    name="numCredenciamento"
                                    value={formData.numCredenciamento || ""}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* ACESSO AO SISTEMA */}
                <div>
                    <h3 className={sectionTitleClass}><Lock size={18}/> Acesso ao Sistema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Login (Usuário)</label>
                            <input
                                type="text"
                                name="login"
                                value={formData.login}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Senha</label>
                            <input
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder={avaliadorToEdit ? "(Deixe em branco para manter)" : ""}
                                required={!avaliadorToEdit}
                            />
                        </div>
                    </div>
                </div>

                {/* RODAPÉ */}
                <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-neutral-onSurface hover:bg-surface-variant transition font-medium"
                    >
                        <XCircle size={18} />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-dark text-secondary-on rounded-xl shadow-md transition font-bold"
                    >
                        <Save size={18} />
                        {avaliadorToEdit ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </div>
    );
}