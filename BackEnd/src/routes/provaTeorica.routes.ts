import express, {Request, Response } from "express";	
import ProvaTeoricaController from "../controllers/provaTeorica.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {   
    await ProvaTeoricaController.criarProvaTeorica(req, res);
});

router.get("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaTeoricaController.buscarProvaTeoricaPorId(req, res);
});

router.get("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaTeoricaController.buscarProvasTeoricas(req, res);
});

router.get("/categoria/:idCategoria", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaTeoricaController.buscarProvasTeoricasPorCategoria(req, res);
});

router.put("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await ProvaTeoricaController.atualizarProvaTeorica(req, res);
});

export default router;