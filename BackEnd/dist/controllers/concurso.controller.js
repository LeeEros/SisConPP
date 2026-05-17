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
const concurso_service_1 = __importDefault(require("../services/concurso.service"));
const AppError_1 = __importDefault(require("../errors/AppError"));
class ConcursoController {
    criarConcurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeConcurso, lancamentoEdital, inscricoesInicio, inscricoesFinal, dataProvaEscrita, dataProvasPraticas, dataResultado, local } = req.body;
            if (!nomeConcurso || !lancamentoEdital || !inscricoesInicio || !inscricoesFinal || !inscricoesFinal || !dataProvaEscrita || !dataProvasPraticas || !dataResultado || !local) {
                return res.status(400).json({ mensagem: "nomeConcurso, ancamentoEdital, inscricoesInicio, inscricoesFinal, dataProvaEscrita, dataProvasPraticas, dataResultado, local são Obrigatórios" });
            }
            try {
                const concurso = yield concurso_service_1.default.criarConcurso(nomeConcurso, lancamentoEdital, inscricoesInicio, inscricoesFinal, dataProvaEscrita, dataProvasPraticas, dataResultado, local);
                return res.status(201).json(concurso);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao criar concurso:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    atualizarConcurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ mensagem: "Dados para atualização são obrigatórios." });
            }
            try {
                const { nomeConcurso, lancamentoEdital, inscricoesInicio, inscricoesFinal, dataProvaEscrita, dataProvasPraticas, dataResultado, local } = data;
                const concurso = {
                    nomeConcurso,
                    lancamentoEdital,
                    inscricoesInicio,
                    inscricoesFinal,
                    dataProvaEscrita,
                    dataProvasPraticas,
                    dataResultado,
                    local
                };
                const Concurso = yield concurso_service_1.default.atualizarConcurso(Number(id), concurso);
                return res.status(200).json(Concurso);
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
    buscarConcursoPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const concurso = yield concurso_service_1.default.buscarConcursoPorId(Number(id));
                return res.status(200).json(concurso);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log("Erro ao buscar concurso:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    buscarConcursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concursos = yield concurso_service_1.default.buscarConcursos();
                return res.status(200).json(concursos);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log("Erro ao buscar concursos:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    deletarConcurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield concurso_service_1.default.deletarConcuro(Number(id));
                return res.status(204).send();
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    return res.status(error.statusCode).json({ message: error.message });
                }
                if (error instanceof Error) {
                    return res.status(400).json({ message: error.message });
                }
                console.error("Erro desconhecido ao deletar concurso:", error);
                return res.status(500).json({ message: "Erro desconhecido." });
            }
        });
    }
    anexarEdital(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { anexoEdital, } = req.body;
            try {
                const concurso = yield concurso_service_1.default.anexarEdital(Number(id), anexoEdital);
                return res.status(200).json(concurso);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao anexar Edital.");
                    return res.status(400).json({ mensahem: error.message });
                }
                return res.status(400).json({ mensagem: "Erro desconhecido." });
            }
        });
    }
}
exports.default = new ConcursoController();
