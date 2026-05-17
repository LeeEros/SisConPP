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
const provaPratica_service_1 = __importDefault(require("../services/provaPratica.service"));
class ProvaPraticaController {
    criarProvaPratica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeProva, notaMaxima, categorias, blocosProvas } = req.body;
            if (!nomeProva || !notaMaxima || !categorias || !blocosProvas) {
                return res.status(400).json({ mensagem: "Nome, notaMaxima, Categorias e blocosProvas da prova prática é obrigatório." });
            }
            try {
                const provaPratica = yield provaPratica_service_1.default.criarProvaPratica(nomeProva, notaMaxima, categorias, blocosProvas);
                return res.status(201).json(provaPratica);
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
    buscarProvaPraticaPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const provaPratica = yield provaPratica_service_1.default.buscarProvaPraticaPorId(Number(id));
                if (!provaPratica) {
                    return res.status(404).json({ mensagem: "Prova prática não encontrada." });
                }
                return res.status(200).json(provaPratica);
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
    buscarProvasPraticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provasPraticas = yield provaPratica_service_1.default.buscarProvasPraticas();
                return res.status(200).json(provasPraticas);
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
    buscarPorCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCategoria } = req.params;
            if (!idCategoria) {
                return res.status(400).json({ error: "Categoria obrigatória" });
            }
            const provas = yield provaPratica_service_1.default.buscarProvaPraticaPorCategoria(Number(idCategoria));
            return res.json(provas);
        });
    }
    atualizarProvaPratica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ mensagem: "Dados para atualização são obrigatórios." });
            }
            try {
                const { categorias, blocosProvas, provaData } = data;
                const provaPratica = yield provaPratica_service_1.default.atualizarProvaPratica(Number(id), categorias, blocosProvas, provaData);
                return res.status(200).json(provaPratica);
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
}
exports.default = new ProvaPraticaController();
