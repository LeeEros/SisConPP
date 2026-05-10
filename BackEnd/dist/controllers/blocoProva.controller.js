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
const blocoProva_service_1 = __importDefault(require("../services/blocoProva.service"));
class BlocoProvaController {
    criarBlocoProva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeBloco, notaMaximaBloco, provaPraticaId } = req.body;
            if (!nomeBloco || !notaMaximaBloco || !provaPraticaId) {
                return res.status(400).json({ mensagem: "Nome do Bloco, Nota Máxima do Bloco e Id da Bloco de Prova são Obrigatórios" });
            }
            try {
                const blocoProva = yield blocoProva_service_1.default.criarBlocoProva(nomeBloco, notaMaximaBloco, provaPraticaId);
                return res.status(201).json(blocoProva);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao criar BlocoProva:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    editarBlocoProva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idBloco, nomeBloco, notaMaximaBloco, provaPraticaId } = req.body;
            if (!idBloco || !nomeBloco || !notaMaximaBloco || !provaPraticaId) {
                return res.status(400).json({ mensagem: "Id do Bloco, Nome do Bloco, Nota Máxima do Bloco e Id da Prova Prática são Obrigatórios" });
            }
            try {
                const blocoProva = yield blocoProva_service_1.default.editarBlocoProva(idBloco, nomeBloco, notaMaximaBloco, provaPraticaId);
                return res.status(200).json(blocoProva);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao editar BlocoProva:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    consultarBlocoProva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idBloco } = req.params;
            if (!idBloco) {
                return res.status(400).json({ mensagem: "Id do Bloco é Obrigatório" });
            }
            try {
                const blocoProva = yield blocoProva_service_1.default.consultarBlocoProva(Number(idBloco));
                return res.status(200).json(blocoProva);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao consultar BlocoProva:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    consultarBlocosProva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blocosProva = yield blocoProva_service_1.default.consultarBlocosProva();
                return res.status(200).json(blocosProva);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao consultar BlocosProva:", error);
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
exports.default = new BlocoProvaController();
