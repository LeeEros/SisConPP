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
const library_1 = require("@prisma/client/runtime/library");
const AppError_1 = __importDefault(require("../errors/AppError"));
const prisma = new client_1.PrismaClient();
class RTService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    criarRT(nomeRT, numeroRT) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rt = yield this.prisma.rT.create({
                    data: {
                        nomeRT: nomeRT,
                        numeroRT: numeroRT,
                    },
                });
                return rt;
            }
            catch (error) {
                throw new Error("Erro ao criar RT. Verifique os dados fornecidos.");
            }
        });
    }
    atualizarRT(idRt, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rt = yield this.prisma.rT.update({
                    where: { idRT: idRt },
                    data: data,
                });
                return rt;
            }
            catch (error) {
                throw new Error("Erro ao atualizar RT. Verifique os dados fornecidos.");
            }
        });
    }
    buscarRTPorId(idRt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rt = yield this.prisma.rT.findUnique({
                    where: { idRT: idRt },
                });
                return rt;
            }
            catch (error) {
                throw new Error("Erro ao buscar RT.");
            }
        });
    }
    buscarRTs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rt = yield this.prisma.rT.findMany();
                return rt;
            }
            catch (error) {
                throw new Error("Erro ao buscar RTs.");
            }
        });
    }
    deletarRT(idRt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rt = yield this.prisma.rT.findUnique({
                    where: { idRT: idRt },
                });
                if (!rt) {
                    throw new AppError_1.default("RT não encontrada.", 404);
                }
                yield this.prisma.rT.delete({
                    where: { idRT: idRt },
                });
                return { message: "RT deletada com sucesso." };
            }
            catch (error) {
                if (error instanceof library_1.PrismaClientKnownRequestError &&
                    error.code === "P2003") {
                    throw new AppError_1.default("Não é possível deletar a RT pois ela está associado a outros registros.", 409);
                }
                if (error instanceof AppError_1.default) {
                    throw error;
                }
                throw new AppError_1.default("Erro ao deletar RT", 500);
            }
        });
    }
}
const rtService = new RTService(prisma);
exports.default = rtService;
