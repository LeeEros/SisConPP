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
const express_1 = __importDefault(require("express"));
const comissao_controller_1 = __importDefault(require("../controllers/comissao.controller"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/avaliador", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.adicionarAvaliadorComissao(req, res);
}));
router.post("/auxiliar", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.adicionarAuxiliarComissao(req, res);
}));
router.get("/usuarios", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.listarUsuariosComissao(req, res);
}));
router.delete("/usuario/:usuarioId/:comissaoId", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.deletarUsuarioComissao(req, res);
}));
router.post("/atribuir", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.atribuiacaoAvaliacao(req, res);
}));
router.post("/", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.criarComissao(req, res);
}));
router.put("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.atualizarComissao(req, res);
}));
router.get("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.buscarComissaoPorId(req, res);
}));
router.get("/", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.buscarTodasComissoes(req, res);
}));
router.delete("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comissao_controller_1.default.deletarComissao(req, res);
}));
exports.default = router;
