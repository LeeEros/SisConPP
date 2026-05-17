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
const client_1 = require("@prisma/client");
const recurso_service_1 = __importDefault(require("../services/recurso.service"));
class RecursoController {
    solicitarRecurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeRecurso, justificativa, arquivo, candidato, avaliador, quesitoRecurso, avaliacaoId, provaTeoricaIdprovaTeorica, provaPraticaIdProvaPratica } = req.body;
            if (!nomeRecurso ||
                !justificativa ||
                !arquivo ||
                !candidato ||
                !avaliador ||
                !quesitoRecurso ||
                !avaliacaoId) {
                return res.status(400).json({
                    mensagem: "Campos obrigatórios não informados."
                });
            }
            try {
                const recurso = yield recurso_service_1.default.solicitarRecurso(nomeRecurso, justificativa, arquivo, Number(candidato), Number(avaliador), Number(quesitoRecurso), Number(avaliacaoId), provaTeoricaIdprovaTeorica
                    ? Number(provaTeoricaIdprovaTeorica)
                    : undefined, provaPraticaIdProvaPratica
                    ? Number(provaPraticaIdProvaPratica)
                    : undefined);
                return res.status(201).json(recurso);
            }
            catch (error) {
                return res.status(400).json({
                    mensagem: error instanceof Error
                        ? error.message
                        : "Erro desconhecido."
                });
            }
        });
    }
    listarRecursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recursos = yield recurso_service_1.default.listarRecursos();
                return res.status(200).json(recursos);
            }
            catch (error) {
                return res.status(400).json({
                    mensagem: error instanceof Error ? error.message : "Erro desconhecido."
                });
            }
        });
    }
    visualizarRecursoPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }
            try {
                const recurso = yield recurso_service_1.default.visualizarRecursoPorId(id);
                if (!recurso) {
                    return res.status(404).json({ mensagem: "Recurso não encontrado." });
                }
                return res.status(200).json(recurso);
            }
            catch (error) {
                return res.status(400).json({
                    mensagem: error instanceof Error ? error.message : "Erro desconhecido."
                });
            }
        });
    }
    alterarStatusRecurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const { status } = req.body;
            if (!status || isNaN(id)) {
                return res.status(400).json({ mensagem: "ID e status são obrigatórios." });
            }
            try {
                const recurso = yield recurso_service_1.default.alterarStatusRecurso(id, mapStatus(status));
                return res.status(200).json(recurso);
            }
            catch (error) {
                return res.status(400).json({
                    mensagem: error instanceof Error ? error.message : "Erro desconhecido."
                });
            }
        });
    }
    listarQuesitosAvaliados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidatoId = Number(req.params.candidatoId);
            const avaliadorId = Number(req.params.avaliadorId);
            try {
                const quesitos = yield recurso_service_1.default.listarQuesitosAvaliadosPorCandidatoEAvaliador(candidatoId, avaliadorId);
                return res.status(200).json(quesitos);
            }
            catch (error) {
                return res.status(400).json({
                    mensagem: error instanceof Error ? error.message : "Erro desconhecido."
                });
            }
        });
    }
}
function mapStatus(status) {
    if (status === true || status === "DEFERIDO")
        return client_1.StatusRecurso.DEFERIDO;
    if (status === false || status === "INDEFERIDO")
        return client_1.StatusRecurso.INDEFERIDO;
    return client_1.StatusRecurso.PENDENTE;
}
exports.default = new RecursoController();
