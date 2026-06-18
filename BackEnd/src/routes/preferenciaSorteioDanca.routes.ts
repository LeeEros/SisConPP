import express, { Request, Response } from "express";
import PreferenciaSorteioDancaController from "../controllers/preferenciaSorteioDanca.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async (req: Request, res: Response) => {
    await PreferenciaSorteioDancaController.criarPreferencias(req, res);
});

router.get("/:candidatoId", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async (req: Request, res: Response) => {
    await PreferenciaSorteioDancaController.visualizarPreferencias(req, res);
});

router.put("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async (req: Request, res: Response) => {
    await PreferenciaSorteioDancaController.atualizarSorteioDancaId(req, res);
});

export default router;