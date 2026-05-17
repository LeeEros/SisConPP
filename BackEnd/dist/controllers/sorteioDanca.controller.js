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
const sorteioDanca_service_1 = __importDefault(require("../services/sorteioDanca.service"));
class SorteioDancaController {
    realizarSorteio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidatoId, usuarioId, tipoDanca } = req.body;
            if (!candidatoId || !usuarioId || !tipoDanca) {
                return res.status(400).json({ error: "Os campos candidatoId e usuarioId são obrigatórios." });
            }
            try {
                const resultado = yield sorteioDanca_service_1.default.realizarSorteio(candidatoId, usuarioId, tipoDanca);
                return res.status(200).json(resultado);
            }
            catch (error) {
                console.error("Erro ao realizar sorteio de dança:", error);
                return res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = new SorteioDancaController();
