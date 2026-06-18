import express, { Request, Response } from "express";
import ProvaPraticaController from "../controllers/provaPratica.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaPraticaController.criarProvaPratica(req, res);
});

router.get("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaPraticaController.buscarProvaPraticaPorId(req, res);
});

router.get("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaPraticaController.buscarProvasPraticas(req, res);
});

router.get("/categoria/:idCategoria", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaPraticaController.buscarPorCategoria(req, res);
});

router.put("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaPraticaController.atualizarProvaPratica(req, res);
});

export default router;