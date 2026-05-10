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
const avaliacao_service_1 = __importDefault(require("../services/avaliacao.service"));
class AvaliacaoController {
    criarAvaliacaoCompleta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { comissaoId, avaliadorId, candidatoId, blocoProvaId, provaPraticaId, quesitos, ficha } = req.body;
                if (!comissaoId ||
                    !avaliadorId ||
                    !candidatoId ||
                    !blocoProvaId ||
                    !provaPraticaId ||
                    !Array.isArray(quesitos)) {
                    return res.status(400).json({
                        message: "Dados obrigatórios não informados",
                    });
                }
                const avaliacao = yield avaliacao_service_1.default.criarAvaliacaoCompleta({
                    comissaoId,
                    avaliadorId,
                    candidatoId,
                    blocoProvaId,
                    provaPraticaId,
                    quesitos,
                    ficha
                });
                return res.status(201).json(avaliacao);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Erro ao criar avaliação",
                    error: error instanceof Error ? error.message : error,
                });
            }
        });
    }
    editarAvaliacao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idAvalicao, candidatoId, avaliadorId } = req.body;
            if (!idAvalicao || !avaliadorId || !candidatoId) {
                return res.status(400).json({ mensagem: "Id da Avaliação e Id do Avaliador e Id Candidato são obrigatórios." });
            }
            try {
                const avaliacao = yield avaliacao_service_1.default.editarAvaliacao(idAvalicao, candidatoId, avaliadorId);
                return res.status(200).json(avaliacao);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao editar avaliação:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(500).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    visualizarAvaliacoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidatoId } = req.params;
            if (!candidatoId) {
                return res.status(400).json({ mensagem: "Id do Candidato é obrigatório." });
            }
            try {
                const avaliacoes = yield avaliacao_service_1.default.visualizarAvaliacoes(Number(candidatoId));
                return res.status(200).json(avaliacoes);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao visualizar avaliações:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(500).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    listarAvaliacoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avaliacoes = yield avaliacao_service_1.default.listarAvaliacoes();
                return res.status(200).json(avaliacoes);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao listar avaliações:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(500).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    buscarEstruturaCompleta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { avaliadorId, candidatoId } = req.params;
            try {
                const estrutura = yield avaliacao_service_1.default.buscarEstruturaCompleta(Number(avaliadorId), Number(candidatoId));
                return res.status(200).json(estrutura);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao buscar provas:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(500).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
    criarAvaliacaoTeorica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidatoId, avaliadorId, provaTeoricaId, quesitos, ficha } = req.body;
                if (!candidatoId || !avaliadorId || !provaTeoricaId || !Array.isArray(quesitos) || !ficha) {
                    return res.status(400).json({ message: "Dados obrigatórios não informados" });
                }
                const avaliacaoTeorica = yield avaliacao_service_1.default.criarAvaliacaoTeorica({
                    candidatoId,
                    avaliadorId,
                    provaTeoricaId,
                    quesitos,
                    ficha,
                });
                return res.status(201).json(avaliacaoTeorica);
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    buscarEstruturaTeorica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidatoId } = req.params;
            try {
                const estrutura = yield avaliacao_service_1.default.buscarEstruturaTeorica(Number(candidatoId));
                return res.status(200).json(estrutura);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao buscar provas:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                return res.status(500).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
}
exports.default = new AvaliacaoController();
