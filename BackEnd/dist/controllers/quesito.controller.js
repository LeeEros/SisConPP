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
const quesito_service_1 = __importDefault(require("../services/quesito.service"));
class QuesitoController {
    criarQuesito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeQuesito, notaMaximaQuesito, opcional, blocoProvaIdBloco, provaTeoricaIdprovaTeorica } = req.body;
            if (!nomeQuesito || !notaMaximaQuesito) {
                return res.status(400).json({ mensagem: "Nome do Quesito, Nota Máxima do Quesito, Dança e Dança Salão Tradicional são obrigatórios." });
            }
            try {
                const quesito = yield quesito_service_1.default.criarQuesitos(nomeQuesito, notaMaximaQuesito, opcional, blocoProvaIdBloco, provaTeoricaIdprovaTeorica);
                return res.status(201).json(quesito);
            }
            catch (error) {
                console.error("Erro ao criar Quesito", error);
                return res.status(400).json({ mensagem: "Erro ao criar o Quesito. Verifique os dados fornecidos." });
            }
        });
    }
    atualizarQuesito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ mensagem: "Dados para atualização são obrigatórios." });
            }
            try {
                const quesito = yield quesito_service_1.default.atualizarQuesitos(Number(id), data);
                return res.status(200).json(quesito);
            }
            catch (error) {
                console.error("Erro ao atualizar Quesito", error);
                return res.status(400).json({ mensagem: "Erro ao atualizar o Quesito. Verifique os dados fornecidos." });
            }
        });
    }
    buscarQuesitoPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const quesito = yield quesito_service_1.default.buscarQuesitoPorId(Number(id));
                if (!quesito) {
                    return res.status(404).json({ mensagem: "Quesito não encontrado." });
                }
                return res.status(200).json(quesito);
            }
            catch (error) {
                console.error("Erro ao buscar Quesito", error);
                return res.status(400).json({ mensagem: "Erro ao buscar o Quesito." });
            }
        });
    }
    buscarQuesitos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quesitos = yield quesito_service_1.default.buscarQuesitos();
                return res.status(200).json(quesitos);
            }
            catch (error) {
                console.error("Erro ao buscar Quesitos", error);
                return res.status(400).json({ mensagem: "Erro ao buscar os Quesitos." });
            }
        });
    }
    deletarQuesito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield quesito_service_1.default.deletarQuesito(Number(id));
                return res.status(200).json({ mensagem: "Quesito deletado com sucesso." });
            }
            catch (error) {
                console.error("Erro ao deletar Quesito", error);
                return res.status(400).json({ mensagem: "Erro ao deletar o Quesito." });
            }
        });
    }
}
exports.default = new QuesitoController();
