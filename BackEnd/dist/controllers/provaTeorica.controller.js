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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const provaTeorica_service_1 = __importDefault(require("../services/provaTeorica.service"));
class ProvaTeoricaController {
    criarProvaTeorica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeProva, notaMaxima, categorias, gabaritoOficial, numQuestao } = req.body;
            if (!nomeProva || !notaMaxima || !categorias || !numQuestao) {
                return res.status(400).json({ mensagem: "Nome, notaMaxima, Categorias, gabaritoOficial e numQuestao da prova teórica é obrigatório." });
            }
            try {
                const provaTeorica = yield provaTeorica_service_1.default.criarProvaTeorica(nomeProva, notaMaxima, categorias, gabaritoOficial, numQuestao);
                return res.status(201).json(provaTeorica);
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
    buscarProvaTeoricaPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const provaTeorica = yield provaTeorica_service_1.default.buscarProvaTeoricaPorId(Number(id));
                if (!provaTeorica) {
                    return res.status(404).json({ mensagem: "Prova teórica não encontrada." });
                }
                return res.status(200).json(provaTeorica);
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
    buscarProvasTeoricas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provasTeoricas = yield provaTeorica_service_1.default.buscarProvasTeoricas();
                return res.status(200).json(provasTeoricas);
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
    buscarProvasTeoricasPorCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCategoria } = req.params;
            if (!idCategoria) {
                return res.status(400).json({ error: "Categoria obrigatória" });
            }
            const provas = yield provaTeorica_service_1.default.buscarProvaTeoricaPorCategoria(Number(idCategoria));
            return res.json(provas);
        });
    }
    atualizarProvaTeorica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            try {
                const { gabaritoOficinal, numQuestao } = data, provaData = __rest(data, ["gabaritoOficinal", "numQuestao"]);
                const provaTeorica = yield provaTeorica_service_1.default.atualizarProvaTeorica(Number(id), gabaritoOficinal, numQuestao, provaData);
                return res.status(200).json(provaTeorica);
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
exports.default = new ProvaTeoricaController();
