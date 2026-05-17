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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CategoriaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarCategoria(nomeCategoria, escolaridade, sorteioDanca, idadeInicial, idadeLimite, provaTeoricaId, provaPraticaId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.categoria.create({
                    data: {
                        nomeCategoria,
                        escolaridade,
                        sorteioDanca,
                        idadeInicial,
                        idadeLimite,
                        provaTeoricaId,
                        provaPraticaId,
                    },
                });
            }
            catch (error) {
                throw new Error(`Erro ao criar categoria: ${error.message}`);
            }
        });
    }
    listarCategorias() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.categoria.findMany();
            }
            catch (error) {
                throw new Error(`Erro ao listar categorias: ${error.message}`);
            }
        });
    }
    atualizarCategoria(idCategoria, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.categoria.update({
                    where: { idCategoria },
                    data: dados,
                });
            }
            catch (error) {
                throw new Error(`Erro ao atualizar categoria: ${error.message}`);
            }
        });
    }
    deletarCategoria(idCategoria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.categoria.delete({
                    where: { idCategoria },
                });
            }
            catch (error) {
                throw new Error(`Erro ao deletar categoria: ${error.message}`);
            }
        });
    }
}
const categoriaService = new CategoriaService(prisma);
exports.default = categoriaService;
