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
const avaliacao_controller_1 = __importDefault(require("../controllers/avaliacao.controller"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/avaliacaoCompleta", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AVALIADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield avaliacao_controller_1.default.criarAvaliacaoCompleta(req, res);
}));
router.post("/avaliacaoTeorica", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AVALIADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield avaliacao_controller_1.default.criarAvaliacaoTeorica(req, res);
}));
router.get("/avaliacao/:idAvaliacao", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AVALIADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield avaliacao_controller_1.default.visualizarAvaliacoes(req, res);
}));
router.put("/avaliacao/:idAvaliacao", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AVALIADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield avaliacao_controller_1.default.editarAvaliacao(req, res);
}));
router.get("/avaliacao/:avaliadorId/:candidatoId", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AVALIADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield avaliacao_controller_1.default.buscarEstruturaCompleta(req, res);
}));
router.get("/avaliacaoTeorica/:candidatoId", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AVALIADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield avaliacao_controller_1.default.buscarEstruturaTeorica(req, res);
}));
router.get("/avaliacoes", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AVALIADOR", "AUXILIAR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield avaliacao_controller_1.default.listarAvaliacoes(req, res);
}));
exports.default = router;
