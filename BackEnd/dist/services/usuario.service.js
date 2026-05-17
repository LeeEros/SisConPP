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
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const prisma = new client_1.PrismaClient();
class UsuarioService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarUsuarioComPessoa(nomeCompleto, cidade, estado, CTGId, numCarteirinha, login, senha, funcao, credenciamento, numCredenciamento, comissaoUsuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const senhaCriptografada = yield bcrypt_1.default.hash(senha, 10);
                const usuario = yield this.prisma.usuario.create({
                    data: {
                        nomeCompleto,
                        cidade,
                        estado,
                        CTGId,
                        numCarteirinha,
                        login,
                        senha: senhaCriptografada,
                        funcao,
                        credenciamento,
                        numCredenciamento,
                        comissaoUsuarioId,
                    },
                });
                return { usuario };
            }
            catch (error) {
                console.error("Erro detalhado:", error);
                throw new Error("Erro ao criar usuário com pessoa. Verifique os dados fornecidos.");
            }
        });
    }
    atualizarUsuario(idUsuario, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filteredData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
                if (data.credenciamento === client_1.Credenciamento.NAO_CREDENCIADO) {
                    filteredData.numCredenciamento = 0;
                }
                const usuario = yield this.prisma.usuario.update({
                    where: { idUsuario },
                    data: filteredData,
                });
                return usuario;
            }
            catch (error) {
                console.error(error);
                throw new Error("Erro ao atualizar usuário com pessoa. Verifique os dados fornecidos.");
            }
        });
    }
    listarUsuariosAvaliadores() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avaliadores = yield this.prisma.usuario.findMany({
                    where: { funcao: client_1.Funcao.AVALIADOR },
                    include: {
                        ComissaoUsuario: {
                            include: {
                                Comissao: true,
                            },
                        },
                    },
                });
                return avaliadores;
            }
            catch (error) {
                console.error(error);
                throw new Error("Erro ao listar usuários avaliadores.");
            }
        });
    }
    listarUsuariosSecretarios() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const secretarios = yield this.prisma.usuario.findMany({
                    where: { funcao: client_1.Funcao.SECRETARIO }
                });
                return secretarios;
            }
            catch (error) {
                console.error(error);
                throw new Error("Erro ao listar usuários secretários.");
            }
        });
    }
    listarUsuariosAuxiliares() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auxiliares = yield this.prisma.usuario.findMany({
                    where: { funcao: client_1.Funcao.AUXILIAR }
                });
                return auxiliares;
            }
            catch (error) {
                console.error(error);
                throw new Error("Erro ao listar usuários auxiliares.");
            }
        });
    }
    buscarUsuarioPorId(idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Usuario = yield this.prisma.usuario.findUnique({
                    where: { idUsuario: idUsuario }
                });
                return Usuario;
            }
            catch (error) {
                throw new Error("Erro ao buscar usuário.");
            }
        });
    }
    buscarUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Usuarios = yield this.prisma.usuario.findMany({});
                return Usuarios;
            }
            catch (error) {
                throw new Error("Erro ao buscar usuários.");
            }
        });
    }
    deletarUsuario(idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuario = yield this.prisma.usuario.findUnique({
                    where: { idUsuario }
                });
                if (!usuario) {
                    throw new AppError_1.default("Usuário não encontrado.", 404);
                }
                yield this.prisma.usuario.delete({
                    where: { idUsuario }
                });
                return { message: "Usuário deletado com sucesso." };
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                    throw new AppError_1.default("Não é possível deletar o usuário pois ele está associado a outros registros.", 409);
                }
                if (error instanceof AppError_1.default) {
                    throw error;
                }
                throw new AppError_1.default("Erro ao deletar usuário.", 500);
            }
        });
    }
}
const usuarioService = new UsuarioService(prisma);
exports.default = usuarioService;
