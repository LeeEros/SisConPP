import React, { useEffect, useState } from "react";
import { Candidato, ProvaCampeiraEsportiva } from "../../types/Candidato";
import { CTG } from '../../types/CTG';
import { atualizarCandidato, cadastrarCandidato, listarCTGs, listarCategorias } from '../../services/api';
import { Categoria } from "../../types/Categoria";
import { toast } from "react-toastify";
import { Upload, XCircle, Save } from "lucide-react";

interface CandidatoFormProps {
    onClose: () => void;
    candidatoToEdit?: Candidato;
}

const estados = [
    'Paraná', 'Santa Catarina', 'Rio Grande do Sul'
];

export default function CandidatoForm({ onClose, candidatoToEdit }: CandidatoFormProps) {
    const [formData, setFormData] = useState<Candidato>({
        idCandidato: 0,
        nomeCompleto: '',
        cidade: '',
        estado: '',
        CTGId: 0,
        numCarteirinha: '',
        CPF: '',
        RG: '',
        endereco: '',
        numEndereco: 0,
        bairro: '',
        escolaridade: '',
        filiacaoPai: '',
        filiacaoMae: '',
        ProvaCampeiraEsportiva: undefined,
        anexoFoto: undefined,
        anexoDocumento: undefined,
        anexoCarteirinha: undefined,
        anexoEscolaridade: undefined,
        anexoResidencia: undefined,
        anexoAtaConcurso: undefined,
        fichaInscricao: undefined,
        anexoTermoCandidato: undefined,
        anexoRelatorioVivencia: undefined,
        anexoResponsavel: undefined,
        anexoProvaEsportivaCampeira: undefined,
        categoriaId: 0
    });

    const [ctgs, setCTGs] = useState<{ id: string; nome: string }[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

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
        const fetchCategorias = async () => {
            try {
                const response = await listarCategorias();
                setCategorias(response as Categoria[]);
            } catch (error) {
                console.error('Erro ao buscar Categorias:', error);
            }
        };
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (candidatoToEdit) {
            setFormData({
                idCandidato: candidatoToEdit.idCandidato,
                nomeCompleto: candidatoToEdit.nomeCompleto || '',
                cidade: candidatoToEdit.cidade || '',
                estado: candidatoToEdit.estado || '',
                CTGId: candidatoToEdit.CTGId || 0,
                numCarteirinha: candidatoToEdit.numCarteirinha || '',
                CPF: candidatoToEdit.CPF || '',
                RG: candidatoToEdit.RG || '',
                endereco: candidatoToEdit.endereco || '',
                numEndereco: candidatoToEdit.numEndereco || 0,
                bairro: candidatoToEdit.bairro || '',
                escolaridade: candidatoToEdit.escolaridade || '',
                filiacaoPai: candidatoToEdit.filiacaoPai || '', // Carrega Pai
                filiacaoMae: candidatoToEdit.filiacaoMae || '', // Carrega Mãe
                ProvaCampeiraEsportiva: candidatoToEdit.ProvaCampeiraEsportiva,
                anexoFoto: candidatoToEdit.anexoFoto,
                anexoDocumento: candidatoToEdit.anexoDocumento,
                anexoCarteirinha: candidatoToEdit.anexoCarteirinha,
                anexoEscolaridade: candidatoToEdit.anexoEscolaridade,
                anexoResidencia: candidatoToEdit.anexoResidencia,
                anexoAtaConcurso: candidatoToEdit.anexoAtaConcurso,
                fichaInscricao: candidatoToEdit.fichaInscricao,
                anexoTermoCandidato: candidatoToEdit.anexoTermoCandidato,
                anexoRelatorioVivencia: candidatoToEdit.anexoRelatorioVivencia,
                anexoResponsavel: candidatoToEdit.anexoResponsavel,
                anexoProvaEsportivaCampeira: candidatoToEdit.anexoProvaEsportivaCampeira,
                categoriaId: candidatoToEdit.categoriaId || 0
            });
        }
    }, [candidatoToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'CTGId' || name === 'numEndereco' || name === 'categoriaId' ? Number(value) : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const candidatoPayload: Candidato = {
                idCandidato: formData.idCandidato,
                nomeCompleto: formData.nomeCompleto,
                cidade: formData.cidade,
                estado: formData.estado,
                CTGId: formData.CTGId,
                numCarteirinha: formData.numCarteirinha,
                categoriaId: formData.categoriaId,
                CPF: formData.CPF,
                RG: formData.RG,
                endereco: formData.endereco,
                numEndereco: formData.numEndereco,
                bairro: formData.bairro,
                escolaridade: formData.escolaridade,
                filiacaoPai: formData.filiacaoPai,
                filiacaoMae: formData.filiacaoMae,
                ProvaCampeiraEsportiva: formData.ProvaCampeiraEsportiva,
                anexoFoto: formData.anexoFoto || undefined,
                anexoDocumento: formData.anexoDocumento || undefined,
                anexoCarteirinha: formData.anexoCarteirinha || undefined,
                anexoEscolaridade: formData.anexoEscolaridade || undefined,
                anexoResidencia: formData.anexoResidencia || undefined,
                anexoAtaConcurso: formData.anexoAtaConcurso || undefined,
                fichaInscricao: formData.fichaInscricao || undefined,
                anexoTermoCandidato: formData.anexoTermoCandidato || undefined,
                anexoRelatorioVivencia: formData.anexoRelatorioVivencia || undefined,
                anexoResponsavel: formData.anexoResponsavel || undefined,
                anexoProvaEsportivaCampeira: formData.anexoProvaEsportivaCampeira || undefined,
            };

            console.log(candidatoPayload);

            if (formData.idCandidato > 0) {
                await atualizarCandidato(candidatoPayload);
                toast.success('Candidato atualizado com sucesso!');
            } else {
                await cadastrarCandidato(candidatoPayload);
                toast.success('Candidato cadastrado com sucesso!');
            }

            onClose();
        } catch (error) {
            console.error("Erro ao salvar Candidato", error);
            toast.error("Erro ao salvar Cadidato. Verefique os dados e tente novamente");
        }

    };


    const inputClass = "w-full rounded-xl border border-outline bg-surface-containerHigh p-2.5 text-neutral-onSurface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-neutral-onSurface mb-1.5";
    const sectionTitleClass = "text-lg font-bold text-primary border-b border-outline-variant pb-2 mb-4 mt-6 flex items-center gap-2";

    return (
        <div className="w-full text-neutral-onBackground">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-dark">
                    {candidatoToEdit ? 'Editar Candidato' : 'Novo Candidato'}
                </h1>
                <p className="text-sm text-neutral-onSurface opacity-70">
                    Preencha as informações abaixo para realizar o cadastro.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <h3 className={sectionTitleClass}>Dados Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Nome Completo</label>
                            <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required className={inputClass} placeholder="Ex: Ana Maria da Silva" />
                        </div>

                        <div>
                            <label className={labelClass}>CPF</label>
                            <input type="text" name="CPF" value={formData.CPF} onChange={handleChange} required className={inputClass} placeholder="000.000.000-00" />
                        </div>

                        <div>
                            <label className={labelClass}>RG</label>
                            <input type="text" name="RG" value={formData.RG} onChange={handleChange} required className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Escolaridade</label>
                            <select name="escolaridade" value={formData.escolaridade} onChange={handleChange} required className={inputClass}>
                                <option value="">Selecione uma Opção</option>
                                <option value="Analfabeto">Analfabeto</option>
                                <option value="Ensino Fundamental - Cursando">Ensino Fundamental - Cursando</option>
                                <option value="Ensino Fundamental - Completo">Ensino Fundamental - Completo</option>
                                <option value="Ensino Médio - Cursando">Ensino Médio - Cursando</option>
                                <option value="Ensino Médio - Completo">Ensino Médio - Completo</option>
                                <option value="Ensino Técnico - Cursando">Ensino Técnico - Cursando</option>
                                <option value="Ensino Técnico - Completo">Ensino Técnico - Completo</option>
                                <option value="Ensino Superior - Cursando">Ensino Superior - Cursando</option>
                                <option value="Ensino Superior - Completo">Ensino Superior - Completo</option>
                                <option value="Pós-graduação - Cursando">Pós-graduação - Cursando</option>
                                <option value="Pós-graduação - Completo">Pós-graduação - Completo</option>
                                <option value="Mestrado - Cursando">Mestrado - Cursando</option>
                                <option value="Mestrado - Completo">Mestrado - Completo</option>
                                <option value="Doutorado - Cursando">Doutorado - Cursando</option>
                                <option value="Doutorado - Completo">Doutorado - Completo</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Nome do Pai</label>
                            <input type="text" name="filiacaoPai" value={formData.filiacaoPai} onChange={handleChange} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Nome da Mãe</label>
                            <input type="text" name="filiacaoMae" value={formData.filiacaoMae} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className={sectionTitleClass}>Vínculo Tradicionalista</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>CTG</label>
                            <select name="CTGId" value={formData.CTGId} onChange={handleChange} required className={inputClass}>
                                <option value="">Selecione o CTG...</option>
                                {ctgs.map(ctg => <option key={ctg.id} value={ctg.id}>{ctg.nome}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Categoria</label>
                            <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} required className={inputClass}>
                                <option value="">Selecione...</option>
                                {categorias.map(cat => <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nomeCategoria}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Nº Carteirinha</label>
                            <input type="text" name="numCarteirinha" value={formData.numCarteirinha} onChange={handleChange} required className={inputClass} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Prova Campeira/Esportiva?</label>
                            <select name="ProvaCampeiraEsportiva" value={formData.ProvaCampeiraEsportiva} onChange={handleChange} required className={inputClass}>
                                <option value="">Selecione...</option>
                                <option value={ProvaCampeiraEsportiva.AMBAS}>Ambas</option>
                                <option value={ProvaCampeiraEsportiva.CAMPEIRA}>Apenas Campeira</option>
                                <option value={ProvaCampeiraEsportiva.ESPORTIVA}>Apenas Esportiva</option>
                                <option value={ProvaCampeiraEsportiva.NENHUMA}>Nenhuma</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className={sectionTitleClass}>Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-4">
                            <label className={labelClass}>Rua/Logradouro</label>
                            <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Número</label>
                            <input type="number" name="numEndereco" value={formData.numEndereco} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Bairro</label>
                            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Cidade</label>
                            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Estado</label>
                            <select name="estado" value={formData.estado} onChange={handleChange} required className={inputClass}>
                                <option value="">UF</option>
                                {estados.map(est => <option key={est} value={est}>{est}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className={sectionTitleClass}>Anexos e Documentos</h3>
                    <div className="bg-surface-containerLowest p-4 rounded-xl border border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                        {[
                            { label: "Foto do Candidato", name: "anexoFoto" },
                            { label: "Documento com Foto", name: "anexoDocumento" },
                            { label: "Carteirinha MTG", name: "anexoCarteirinha" },
                            { label: "Comp. Escolaridade", name: "anexoEscolaridade" },
                            { label: "Comp. Residência", name: "anexoResidencia" },
                            { label: "Ata do Concurso", name: "anexoAtaConcurso" },
                            { label: "Ficha de Inscrição", name: "fichaInscricao" },
                            { label: "Termo do Candidato", name: "anexoTermoCandidato" },
                            { label: "Relatório de Vivência", name: "anexoRelatorioVivencia" },
                            { label: "Termo do Responsável", name: "anexoResponsavel" },
                            { label: "Rel. Prova Campeira", name: "anexoProvaEsportivaCampeira" },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label className="text-xs font-semibold text-neutral-onSurface mb-1 flex items-center gap-1">
                                    <Upload size={14} className="text-primary" /> {field.label}
                                </label>
                                <input
                                    type="file"
                                    name={field.name}
                                    onChange={handleFileChange}
                                    className="text-xs text-neutral-onSurface file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-primary-onContainer hover:file:bg-primary hover:file:text-white transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-6  bottom-0 bg-neutral-surface z-10 pb-2">
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
                        {candidatoToEdit ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </div>
    );
}