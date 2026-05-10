import axios, { AxiosRequestHeaders } from "axios";
import { RT } from "../types/RT";
import { CTG } from "../types/CTG";
import { Usuario } from "../types/Usuario";
import { Candidato, FichaCandidato } from "../types/Candidato";
import { Concurso } from "../types/Concurso";
import { Comissao, ComissaoProvaPraticaForm } from "../types/Comissao";
import {
  PreferenciaSorteio,
  Danca,
  CriarSorteioPayload,
} from "../types/SorteioDanca";
import {
  BlocoProva,
  ProvaPratica,
  Quesitos,
  SubQuesitos,
} from "../types/ProvaPratica";
import { ProvaTeorica, ProvaTeoricaF } from "../types/ProvaTeorica";
import {
  RelatorioGeralCandidatoDTO,
  RelatorioRankingDTO,
  RelatorioIndividualDTO,
  RelatorioCategoriaDTO,
} from "../types/Relatorios";
import { CriarAvaliacaoCompletaDTO } from "../types/Avaliacao";
import { RecursoFormData, StatusRecurso } from "../types/Recurso";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---- AUTENTICAÇÃO ----
export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    idUsuario: number;
    nomeCompleto: string;
    login: string;
    funcao?: string;
  };
  message?: string;
}

export const loginUsuario = async (
  dados: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", dados);
  return response.data;
};

// ---- RT ----
export const cadastrarRT = async (novaRT: RT) => {
  return await api.post("/rt", novaRT);
};

export const listarRTs = async () => {
  const response = await api.get("/rt");
  return response.data;
};

export const atualizarRT = (rt: RT) => {
  return api.put(`/rt/${rt.idRT}`, rt);
};

export const deleteRT = async (id: number) => {
  const response = await api.delete(`/rt/${id}`);
  return response.data ?? true;
};

// ---- CTG ----
export const cadastrarCTG = async (novoCTG: CTG) => {
  return await api.post("/ctg", novoCTG);
};

export const listarCTGs = async () => {
  const response = await api.get("/ctg");
  return response.data;
};

export const atualizarCTG = (ctg: CTG) => {
  return api.put(`/ctg/${ctg.idCTG}`, ctg);
};

export const deleteCTG = async (id: number) => {
  const response = await api.delete(`/ctg/${id}`);
  return response.data ?? true;
};

//---- Usuarios ----
export const cadastrarUsuario = async (criarUsuario: Usuario) => {
  return await api.post("/usuario", criarUsuario);
};

export const listarUsuarios = async () => {
  const response = await api.get("/usuario");
  return response.data;
};

export const atualizarUsuario = (usuario: Usuario) => {
  return api.put(`/usuario/${usuario.idUsuario}`, usuario);
};

export const deleteUsuario = async (id: number) => {
  return await api.delete(`/usuario/${id}`);
};

export const listarUsuriosAvaliadores = async (): Promise<Usuario[]> => {
  const response = await api.get<Usuario[]>("/usuario/usuarios/avaliadores");
  return response.data;
};

export const listarUsuriosAuxiliares = async (): Promise<Usuario[]> => {
  const response = await api.get<Usuario[]>("/usuario/usuarios/auxiliares");
  return response.data;
};

//---- Categorias ----
export const listarCategorias = async () => {
  const response = await api.get("/categoria");
  return response.data;
};

//---- Candidatos ----
export const cadastrarCandidato = async (criarCandidato: Candidato) => {
  return await api.post("/candidato", criarCandidato);
};

export const atualizarCandidato = (candidato: Candidato) => {
  return api.put(`/candidato/${candidato.idCandidato}`, candidato);
};

export const listarCandidatos = async () => {
  const response = await api.get("/candidato");
  return response.data;
};

export const buscarCandidatoPorId = async (idConcurso: number) => {
  const response = await api.get(`/candidato/${idConcurso}`);
  return response.data;
};

export const deletarCandidato = async (id: number) => {
  return await api.delete(`/candidato/${id}`);
};

//---- Ficha Candidato ----

export const criarFichaCandidato = async (fichaCandidato: FichaCandidato) => {
  return await api.post("/candidato/fichaCandidato", fichaCandidato);
};

export const buscarFichaCandidatoPorId = async (idCandidato: number) => {
  const response = await api.get(`/candidato/fichaCandidato/${idCandidato}`);
  return response.data;
};

//---- Concursos ----
export const cadastrarConcurso = async (cadastrarConcurso: Concurso) => {
  return await api.post("/concurso", cadastrarConcurso);
};

export const atualizarConcurso = (concurso: Concurso) => {
  return api.put(`/concurso/${concurso.idConcurso}`, concurso);
};

export const deletarConcurso = async (id: number) => {
  return await api.delete(`/concurso/${id}`);
};

export const listarConcurso = async () => {
  const response = await api.get("/concurso");
  return response.data;
};

//---- Comissão ----
export const criarComissao = async (criarComissao: Comissao) => {
  return await api.post("/comissao", criarComissao);
};

export const listarComissoes = async () => {
  const response = await api.get<Comissao[]>("/comissao");
  return response.data;
};

export const atualizarComissao = (comissao: Comissao) => {
  return api.put(`/comissao/${comissao.idComissao}`, comissao);
};

export const deletarComissao = async (id: number) => {
  const response = await api.delete(`/comissao/${id}`);
  return response.data ?? true;
};

export const adicionarAvaliadorComissao = async (
  usuarioId: number,
  comissaoId: number,
) => {
  return await api.post("/comissao/avaliador", { usuarioId, comissaoId });
};

export const adicionarAuxiliarComissao = async (
  usuarioId: number,
  comissaoId: number,
) => {
  return await api.post("/comissao/auxiliar", { usuarioId, comissaoId });
};

export const listarUsuariosComissao = async () => {
  const response = await api.get("/comissao/usuarios");
  return response.data;
};

export const deletarUsuarioComissao = async (
  idUsuario: number,
  idComissao: number,
) => {
  return await api.delete(`/comissao/usuario/${idUsuario}/${idComissao}`);
};

export const atribuirAvaliacaoComissao = async (
  atribuirAvaliacao: ComissaoProvaPraticaForm,
) => {
  return await api.post("/comissao/atribuir", atribuirAvaliacao);
};

//---- Sorteio Danca ----

export const getDancasTradicionais = async (): Promise<Danca[]> => {
  const response = await api.get<Danca[]>("/danca/dancasTradicionais");
  return response.data;
};

export const getDancasSalao = async (): Promise<Danca[]> => {
  const response = await api.get<Danca[]>("/danca/dancasSalao");
  return response.data;
};

export const criarPreferencia = async (
  criarPreferencia: PreferenciaSorteio,
) => {
  return await api.post("/preferenciaSorteioDanca", criarPreferencia);
};

export const realizarSorteio = async (realizarSorteio: CriarSorteioPayload) => {
  return await api.post("/sorteioDanca", realizarSorteio);
};

//---- Provas Teorica ----

export const criarProvaTeorica = async (criarProvaTeorica: ProvaTeoricaF) => {
  return await api.post("/provaTeorica", criarProvaTeorica);
};

export const buscarProvasTeoricas = async () => {
  const response = await api.get<ProvaTeorica[]>("/provaTeorica");
  return response.data;
};

export async function buscarProvasTeoricasPorCategoria(idCategoria: number) {
  const response = await api.get(`/provaTeorica/categoria/${idCategoria}`);
  return response.data;
}

//---- Provas Praticas ----

export const criarProvaPratica = async (criarProvaPratica: ProvaPratica) => {
  return await api.post("/provaPratica", criarProvaPratica);
};

export const buscarProvasPraticas = async () => {
  const response = await api.get<ProvaPratica[]>("/provaPratica");
  return response.data;
};

export async function buscarPorCategoria(idCategoria: number) {
  const response = await api.get(`/provaPratica/categoria/${idCategoria}`);
  return response.data;
}

export const atualizarProvaPratica = async (provaPratica: ProvaPratica) => {
  return api.put(
    `/provaPratica?categoriaId/${provaPratica.idProvaPratica}, provaPratica`,
  );
};

//---- Blocos Prova ----

export const criarBlocoProva = async (criarBlocoProva: BlocoProva) => {
  return await api.post("/blocoProva", criarBlocoProva);
};

export const listarBlocosProva = async () => {
  const response = await api.get<BlocoProva[]>("/blocoProva");
  return response.data;
};

export const deletarBloco = async (idBloco: number) => {
  const response = await api.delete(`/blocoProva/${idBloco}`);
  return response.data ?? true;
};

//---- Quesito e SubQuesito ----

export const criarQuesito = async (criarQuesito: Quesitos) => {
  return await api.post("/quesito", criarQuesito);
};

export const listarQuesitos = async () => {
  const response = await api.get<Quesitos[]>("/quesito");
  return response.data;
};

export const deletarQuesito = async (idQuesito: number) => {
  const response = await api.delete(`/quesito/${idQuesito}`);
  return response.data ?? true;
};

export const criarSubQuesito = async (criarSubQuesito: SubQuesitos) => {
  return await api.post("/subQuesito", criarSubQuesito);
};

export const listarSubQuesitos = async () => {
  const response = await api.get<SubQuesitos[]>("/subQuesito");
  return response.data;
};

export const deletarSubQuesito = async (idSubQuesito: number) => {
  const response = await api.delete(`/subQuesito/${idSubQuesito}`);
  return response.data ?? true;
};

//---- Avaliacação ----

export async function criarAvaliacaoCompleta(
  payload: CriarAvaliacaoCompletaDTO,
) {
  const { data } = await api.post("/avaliacao/avaliacaoCompleta", payload);
  return data;
}

export async function buscarEstruturaAvaliacao(
  avaliadorId: number,
  candidatoId: number,
) {
  const response = await api.get<{ provaPratica: ProvaPratica }>(
    `/avaliacao/avaliacao/${avaliadorId}/${candidatoId}`,
  );
  return response.data.provaPratica;
}

export async function criarAvaliacaoTeorica(
  payload: CriarAvaliacaoCompletaDTO,
) {
  const { data } = await api.post("/avaliacao/avaliacaoTeorica", payload);
  return data;
}

export async function buscarEstruturaTeorica(candidatoId: number) {
  const response = await api.get(`/avaliacao/avaliacaoTeorica/${candidatoId}`);
  return response.data;
}

export async function listarAvaliacoes() {
  const response = await api.get("/avaliacao/avaliacoes");
  return response.data;
}

//---- Relatoriois ----
export async function relatorioGeral(concursoId: number) {
  const response = await api.get<RelatorioGeralCandidatoDTO[]>(
    `/relatorios/relatorio-geral/${concursoId}`,
  );
  return response.data;
}

export async function rankingPorCategoria(
  concursoId: number,
  categoriaId: number,
) {
  const response = await api.get<RelatorioRankingDTO[]>(
    `/relatorios/ranking/${concursoId}/${categoriaId}`,
  );
  return response.data;
}

export async function RelatorioIndividual(candidatoId: number) {
  const response = await api.get<RelatorioIndividualDTO>(
    `/relatorios/individual/${candidatoId}`,
  );
  return response.data;
}

export async function getRelatorioPorCategoriaConcurso(
  categoriaId: number,
  concursoIdConcurso: number,
): Promise<RelatorioCategoriaDTO[]> {
  const response = await api.get<RelatorioCategoriaDTO[]>(
    `/relatorios/relatorioDetalhado/${categoriaId}/${concursoIdConcurso}`,
  );
  console.log(response);
  return response.data;
}

//---- Recurso ----

export async function solicitarRecurso(formData: RecursoFormData) {
  const { data } = await api.post("/recurso", formData);
  return data;
}

export async function listarRecursos() {
  const response = await api.get("/recurso");
  return response.data;
}

export const alterarStatusRecurso = async (
  idRecurso: number,
  status: StatusRecurso,
) => {
  return await api.put(`/recurso/${idRecurso}`, { status });
};

export async function listarQuesitosAvaliadosPorCandidatoEAvaliador(
  candidatoId: number,
  avaliadorId: number,
) {
  const response = await api.get(
    `/recurso/candidato/${candidatoId}/avaliador/${avaliadorId}`,
  );
  return response.data;
}
