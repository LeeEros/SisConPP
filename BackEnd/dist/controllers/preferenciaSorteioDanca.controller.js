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
const preferenciaSorteioDanca_service_1 = __importDefault(require("../services/preferenciaSorteioDanca.service"));
class PreferenciaSorteioDancaController {
    criarPreferencias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nomeSorteioDanca, candidatoId, dancas } = req.body;
            try {
                const preferencias = yield preferenciaSorteioDanca_service_1.default.selecionarPreferenciaSorteioDanca(nomeSorteioDanca, Number(candidatoId), dancas);
                return res.status(201).json(preferencias);
            }
            catch (error) {
                return res.status(400).json({ erro: error.message });
            }
        });
    }
    visualizarPreferencias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidatoId } = req.params;
            try {
                const preferencias = yield preferenciaSorteioDanca_service_1.default.visualizarPreferencias(Number(candidatoId));
                return res.status(200).json(preferencias);
            }
            catch (error) {
                return res.status(400).json({ erro: error.message });
            }
        });
    }
    atualizarSorteioDancaId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidatoId, sorteioDancaId, nomeSorteioDanca } = req.body;
            try {
                const preferenciaAtualizada = yield preferenciaSorteioDanca_service_1.default.atualizarSorteioDancaId(Number(candidatoId), Number(sorteioDancaId), nomeSorteioDanca);
                return res.status(200).json(preferenciaAtualizada);
            }
            catch (error) {
                return res.status(400).json({ erro: error.message });
            }
        });
    }
}
exports.default = new PreferenciaSorteioDancaController();
