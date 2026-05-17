"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const candidato_service_1 = __importDefault(require("../services/candidato.service"));
class CandidatoController {
    criarCandidato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeCompleto, cidade, estado, CTGId, numCarteirinha, categoriaId, CPF, RG, endereco, numEndereco, bairro, escolaridade, filiacaoPai, filiacaoMae, ProvaCampeiraEsportiva, anexoFoto, anexoDocumento, anexoCarteirinha, anexoEscolaridade, anexoResidencia, anexoAtaConcurso, fichaInscricao, anexoTermoCandidato, anexoRelatorioVivencia, anexoResponsavel, anexoProvaEsportivaCampeira, } = req.body;
            if (!categoriaId || !CPF || !RG || !endereco || !numEndereco || !bairro || !escolaridade || !filiacaoPai || !filiacaoMae || !ProvaCampeiraEsportiva) {
                return res.status(400).json({ mensagem: "CategoriaId, CPF, RG, endereco, numEndereco, bairro, escolaridade, filiacao, ProvaCampeiraEsportica, concursoId são Obrigatórios" });
            }
            try {
                const Candidato = yield candidato_service_1.default.criarCandidato(nomeCompleto, cidade, estado, CTGId, numCarteirinha, categoriaId, CPF, RG, endereco, numEndereco, bairro, escolaridade, filiacaoPai, filiacaoMae, ProvaCampeiraEsportiva, anexoFoto, anexoDocumento, anexoCarteirinha, anexoEscolaridade, anexoResidencia, anexoAtaConcurso, fichaInscricao, anexoTermoCandidato, anexoRelatorioVivencia, anexoResponsavel, anexoProvaEsportivaCampeira);
                return res.status(201).json(Candidato);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao criar candidato:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    atualizarCandidato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ mensagem: "Dados para atualização são obrigatórios." });
            }
            try {
                const { nomeCompleto, cidade, estado, CTGId, numCarteirinha, categoriaId, CPF, RG, endereco, numEndereco, bairro, escolaridade, filiacaoPai, filiacaoMae, ProvaCampeiraEsportiva, concursoId } = data;
                const candidatoData = {
                    nomeCompleto, cidade, estado, CTGId, numCarteirinha, categoriaId, CPF, RG,
                    endereco, numEndereco, bairro, escolaridade, filiacaoPai, filiacaoMae, ProvaCampeiraEsportiva, concursoId
                };
                const Candidato = yield candidato_service_1.default.atualizarCandidato(Number(id), candidatoData);
                return res.status(200).json(Candidato);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    buscarCandidatoPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const candidato = yield candidato_service_1.default.buscarCandidatoPorId(Number(id));
                return res.status(200).json(candidato);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao buscar candidato por ID:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    buscarCandidatos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidatos = yield candidato_service_1.default.buscarCandidatos();
                return res.status(200).json(candidatos);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao buscar candidatos:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    deletarCandidato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield candidato_service_1.default.deletarCandidato(Number(id));
                return res.status(204).send();
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao deletar candidato:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    anexarAnexos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { anexoFoto, anexoDocumento, anexoCarteirinha, anexoEscolaridade, anexoResidencia, anexoAtaConcurso, fichaInscricao, anexoTermoCandidato, anexoRelatorioVivencia, anexoResponsavel, anexoProvaEsportivaCampeira } = req.body;
            try {
                const anexos = {
                    anexoFoto,
                    anexoDocumento,
                    anexoCarteirinha,
                    anexoEscolaridade,
                    anexoResidencia,
                    anexoAtaConcurso,
                    fichaInscricao,
                    anexoTermoCandidato,
                    anexoRelatorioVivencia,
                    anexoResponsavel,
                    anexoProvaEsportivaCampeira
                };
                const candidato = yield candidato_service_1.default.anexarAnexos(Number(id), anexos);
                return res.status(200).json(candidato);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao anexar anexos:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    visualizarAnexos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const anexos = yield candidato_service_1.default.visualizarAnexos(Number(id));
                return res.status(200).json(anexos);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao visualizar anexos:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    editarAnexos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { anexoFoto, anexoDocumento, anexoCarteirinha, anexoEscolaridade, anexoResidencia, anexoAtaConcurso, fichaInscricao, anexoTermoCandidato, anexoRelatorioVivencia, anexoResponsavel, anexoProvaEsportivaCampeira } = req.body;
            try {
                const anexos = {
                    anexoFoto,
                    anexoDocumento,
                    anexoCarteirinha,
                    anexoEscolaridade,
                    anexoResidencia,
                    anexoAtaConcurso,
                    fichaInscricao,
                    anexoTermoCandidato,
                    anexoRelatorioVivencia,
                    anexoResponsavel,
                    anexoProvaEsportivaCampeira
                };
                const candidato = yield candidato_service_1.default.editarAnexos(Number(id), anexos);
                return res.status(200).json(candidato);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao editar anexos:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    criarFichaCandidato(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidatoId, concursoId } = req.body;
                if (!candidatoId || !concursoId) {
                    return res.status(400).json({ mensagem: "Candidato Id e ConcursoId são Obrigatórios" });
                }
                const fichaCandidato = yield candidato_service_1.default.criarFichaCandidato(candidatoId, concursoId);
                return res.status(201).json(fichaCandidato);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao criar candidato:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    buscarIdFicha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const fichaCandidato = yield candidato_service_1.default.buscarIdFicha(Number(id));
                return res.status(200).json(fichaCandidato);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao buscar Ficha candidato por ID:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
}
exports.default = new CandidatoController();
