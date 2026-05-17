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
const rt_service_1 = __importDefault(require("../services/rt.service"));
const AppError_1 = __importDefault(require("../errors/AppError"));
class RTController {
    criarRT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeRT, numeroRT } = req.body;
            if (!nomeRT || !numeroRT) {
                return res.status(400).json({ mensagem: "Nome RT e número RT são obrigatórios." });
            }
            try {
                const rt = yield rt_service_1.default.criarRT(nomeRT, numeroRT);
                return res.status(201).json(rt);
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
    atualizarRT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ mensagem: "Dados para atualização são obrigatórios." });
            }
            try {
                const rt = yield rt_service_1.default.atualizarRT(Number(id), data);
                return res.status(200).json(rt);
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
    buscarRTPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const rt = yield rt_service_1.default.buscarRTPorId(Number(id));
                if (!rt) {
                    return res.status(404).json({ mensagem: "RT não encontrado." });
                }
                return res.status(200).json(rt);
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
    buscarRTs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rts = yield rt_service_1.default.buscarRTs();
                return res.status(200).json(rts);
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
    deletarRT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield rt_service_1.default.deletarRT(Number(id));
                return res.status(204).send();
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    return res.status(error.statusCode).json({ message: error.message });
                }
                if (error instanceof Error) {
                    return res.status(400).json({ message: error.message });
                }
                console.error("Erro desconhecido ao deletar RT:", error);
                return res.status(500).json({ message: "Erro desconhecido." });
            }
        });
    }
}
exports.default = new RTController();
