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
const comissao_service_1 = __importDefault(require("../services/comissao.service"));
class ComissaoController {
    criarComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeComissao, concursoId, avaliacoes, usuarios } = req.body;
            if (!nomeComissao || !concursoId) {
                return res.status(400).json({ error: "Nome da comissão e ID do concurso são obrigatórios" });
            }
            try {
                const comissao = yield comissao_service_1.default.criarComissao(nomeComissao, concursoId, avaliacoes || [], usuarios || []);
                return res.status(201).json(comissao);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    atualizarComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nomeComissao } = req.body;
            if (!id) {
                return res.status(400).json({ error: "ID da comissão é obrigatório" });
            }
            try {
                const comissao = yield comissao_service_1.default.atualizarComissao(Number(id), nomeComissao);
                return res.status(200).json(comissao);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    buscarComissaoPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const comissao = yield comissao_service_1.default.buscarComissaoPorId(Number(id));
                return res.status(200).json(comissao);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log("Erro ao buscar concurso:", error);
                    return res.status(400).json({ mensagem: "Erro desconhecido." });
                }
            }
        });
    }
    buscarTodasComissoes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comissoes = yield comissao_service_1.default.buscarTodasComissoes();
                return res.status(200).json(comissoes);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    deletarComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID da comissão é obrigatório" });
            }
            try {
                yield comissao_service_1.default.deletarComissao(Number(id));
                return res.status(200).json({ message: "Comissão deletada com sucesso" });
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    adicionarAvaliadorComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuarioId, comissaoId } = req.body;
            if (!usuarioId || !comissaoId) {
                return res.status(400).json({ error: "Usuário e Comissão são obrigatórios" });
            }
            try {
                const comissaoUsuario = yield comissao_service_1.default.adicionarUsuarioComissao(usuarioId, comissaoId);
                return res.status(201).json(comissaoUsuario);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    adicionarAuxiliarComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuarioId, comissaoId } = req.body;
            if (!usuarioId || !comissaoId) {
                return res.status(400).json({ error: "Usuário e Comissão são obrigatórios" });
            }
            try {
                const comissaoUsuario = yield comissao_service_1.default.adicionarAuxiliarComissao(usuarioId, comissaoId);
                return res.status(201).json(comissaoUsuario);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    deletarUsuarioComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuarioId, comissaoId } = req.params;
            if (!usuarioId || !comissaoId) {
                return res.status(400).json({ error: "Usuário e Comissão são obrigatórios" });
            }
            try {
                yield comissao_service_1.default.deletarUsuarioComissao(Number(usuarioId), Number(comissaoId));
                return res.status(200).json({ message: "Usuário removido da comissão com sucesso" });
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    listarUsuariosComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarios = yield comissao_service_1.default.listComissaoUsuarios();
                return res.status(200).json(usuarios);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
    atribuiacaoAvaliacao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comissaoId, categoriaId, provaPraticaId, blocoProvaId } = req.body;
            try {
                const attribuicao = yield comissao_service_1.default.atribuirAvaliacoes(comissaoId, categoriaId, provaPraticaId, blocoProvaId);
                return res.status(201).json(attribuicao);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = new ComissaoController();
