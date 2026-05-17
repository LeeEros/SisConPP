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
const relatorios_service_1 = __importDefault(require("../services/relatorios.service"));
class RelatoriosController {
    relatorioGeralPorConcurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { concursoId } = req.params;
            if (!concursoId) {
                return res.status(400).json({
                    mensagem: "Id do Concurso é obrigatório"
                });
            }
            try {
                const relatorio = yield relatorios_service_1.default.relatorioGeralPorConcurso(Number(concursoId));
                return res.status(200).json(relatorio);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao gerar relatório geral:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({
                        mensagem: "Erro desconhecido."
                    });
                }
            }
        });
    }
    rankingPorCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { concursoId, categoriaId } = req.params;
            if (!concursoId || !categoriaId) {
                return res.status(400).json({
                    mensagem: "Id do Concurso e Id da Categoria são obrigatórios"
                });
            }
            try {
                const ranking = yield relatorios_service_1.default.rankingPorCategoria(Number(concursoId), Number(categoriaId));
                return res.status(200).json(ranking);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao gerar ranking por categoria:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({
                        mensagem: "Erro desconhecido."
                    });
                }
            }
        });
    }
    relatorioIndividualDetalhado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidatoId } = req.params;
            if (!candidatoId || isNaN(Number(candidatoId))) {
                return res.status(400).json({
                    mensagem: "Id do candidato é obrigatório e deve ser numérico"
                });
            }
            try {
                const relatorioIndividual = yield relatorios_service_1.default.gerarRelatorioIndividualDetalhado(Number(candidatoId));
                return res.status(200).json(relatorioIndividual);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao gerar relatorio individual:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({
                        mensagem: "Erro desconhecido."
                    });
                }
            }
        });
    }
    gerarRelatorioPorCategoriaConcurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoriaId, concursoIdConcurso, } = req.params;
            if (!categoriaId || !concursoIdConcurso) {
                return res.status(400).json({
                    mensagem: "Id da Categoria e Id do Concurso são obrigatórios",
                });
            }
            try {
                const relatorioCategoira = yield relatorios_service_1.default.gerarRelatorioPorCategoriaConcurso(Number(categoriaId), Number(concursoIdConcurso));
                return res.status(200).json(relatorioCategoira);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Erro ao gerar Relatorio por categoria e concurso:", error);
                    return res.status(400).json({ mensagem: error.message });
                }
                else {
                    console.error("Erro desconhecido:", error);
                    return res.status(400).json({
                        mensagem: "Erro desconhecido."
                    });
                }
            }
        });
    }
}
exports.default = new RelatoriosController();
