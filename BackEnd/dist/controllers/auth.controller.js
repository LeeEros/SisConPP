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
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, senha } = req.body;
            if (!login || !senha) {
                return res.status(400).json({ mensagem: "Usuário e senha são obrigatórios." });
            }
            try {
                const resultado = yield auth_service_1.default.login(login, senha);
                if (!resultado) {
                    return res.status(401).json({ mensagem: "Credenciais inválidas." });
                }
                return res.status(200).json({
                    token: resultado.token,
                    usuario: resultado.usuario
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao realizar login:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(500).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    validarToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ mensagem: "Token é obrigatório." });
            }
            try {
                const usuario = yield auth_service_1.default.validarToken(token);
                return res.status(200).json(usuario);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao validar token:", error);
                    return res.status(401).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(500).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
}
exports.default = new AuthController();
