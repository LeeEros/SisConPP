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
const authMiddleware_1 = require("../middlewares/authMiddleware");
const danca_controller_1 = __importDefault(require("../controllers/danca.controller"));
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get("/dancasTradicionais", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AUXILIAR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield danca_controller_1.default.listarDancasTradicionais(req, res);
}));
router.get("/dancasSalao", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AUXILIAR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield danca_controller_1.default.listarDancasSalao(req, res);
}));
router.post("/", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AUXILIAR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield danca_controller_1.default.criarDanca(req, res);
}));
router.put("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AUXILIAR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield danca_controller_1.default.atualizarDanca(req, res);
}));
router.delete("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.permitirFuncoes)(["SECRETARIO", "AUXILIAR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield danca_controller_1.default.deletarDanca(req, res);
}));
exports.default = router;
