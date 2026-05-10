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
const danca_service_1 = __importDefault(require("../services/danca.service"));
class DancaController {
    criarDanca(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nomeDanca, tipo, quesitoId } = req.body;
                const novaDanca = yield danca_service_1.default.criarDanca(nomeDanca, tipo);
                res.status(201).json(novaDanca);
            }
            catch (error) {
                console.error("Erro ao criar dança:", error);
                res.status(500).json({ error: "Erro ao criar dança" });
            }
        });
    }
    atualizarDanca(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const dados = req.body;
                const dancaAtualizada = yield danca_service_1.default.atualizarDanca(Number(id), dados);
                res.json(dancaAtualizada);
            }
            catch (error) {
                console.error("Erro ao atualizar dança:", error);
                res.status(500).json({ error: "Erro ao atualizar dança" });
            }
        });
    }
    listarDancasTradicionais(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dancas = yield danca_service_1.default.buscarDancasTradicionais();
                res.json(dancas);
            }
            catch (error) {
                console.error("Erro ao listar danças tradicionais:", error);
                res.status(500).json({ error: "Erro ao listar danças tradicionais" });
            }
        });
    }
    listarDancasSalao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dancas = yield danca_service_1.default.buscarDancasSalao();
                res.json(dancas);
            }
            catch (error) {
                console.error("Erro ao listar danças de salão:", error);
                res.status(500).json({ error: "Erro ao listar danças de salão" });
            }
        });
    }
    deletarDanca(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield danca_service_1.default.deletarDanca(Number(id));
                res.status(204).send();
            }
            catch (error) {
                console.error("Erro ao deletar dança:", error);
                res.status(500).json({ error: "Erro ao deletar dança" });
            }
        });
    }
}
exports.default = new DancaController();
