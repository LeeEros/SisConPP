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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const SECRET = process.env.JWT_SECRET || "chave-secreta";
class AuthService {
    login(login, senha) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma.usuario.findUnique({
                where: { login }
            });
            if (!usuario) {
                throw new Error("Usuário não encontrado.");
            }
            const senhaValida = yield bcrypt_1.default.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new Error("Senha incorreta.");
            }
            const token = jsonwebtoken_1.default.sign({ id: usuario.idUsuario, login: usuario.login, funcao: usuario.funcao }, process.env.JWT_SECRET || "segredo", { expiresIn: "1d" });
            return {
                token,
                usuario: {
                    id: usuario.idUsuario,
                    nome: usuario.nomeCompleto,
                    login: usuario.login,
                    funcao: usuario.funcao,
                },
            };
        });
    }
    validarToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, SECRET);
                return decoded;
            }
            catch (_a) {
                throw new Error("Token inválido ou expirado.");
            }
        });
    }
}
exports.default = new AuthService();
