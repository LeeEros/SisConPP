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
const categoria_service_1 = __importDefault(require("../services/categoria.service"));
class CategoriaController {
    criarCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeCategoria, escolaridade, sorteioDanca, idadeInicial, idadeLimite, provaTeoricaId, provaPraticaId, } = req.body;
            if (!nomeCategoria || !escolaridade || !sorteioDanca || !idadeInicial) {
                return res.status(400).json({ mensagem: "NomeCategoria, Escolaridade, SorteioDanca, IdadeInicial, ProvaTeoricaId, ProvaPraticaId são Obrigatórios." });
            }
            try {
                const categoria = yield categoria_service_1.default.criarCategoria(nomeCategoria, escolaridade, sorteioDanca, idadeInicial, idadeLimite, provaTeoricaId, provaPraticaId);
                return res.status(201).json(categoria);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao criar categoria", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    atualizarCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ mensagem: "Dadis para atualziação são obrigatóeios." });
            }
            try {
                const categoria = yield categoria_service_1.default.atualizarCategoria(Number(id), data);
                return res.status(200).json(categoria);
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
    buscarCategorias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categorias = yield categoria_service_1.default.listarCategorias();
                return res.status(200).json(categorias);
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
    deletarCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield categoria_service_1.default.deletarCategoria(Number(id));
                return res.status(200).json({ mensagem: "Categoria deleada com sucesso." });
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
exports.default = new CategoriaController();
