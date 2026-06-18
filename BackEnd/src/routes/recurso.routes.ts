import express, { Request, Response } from "express";
import RecursoController from "../controllers/recurso.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]),  async (req: Request, res: Response) => {
    await RecursoController.solicitarRecurso(req, res);
});

router.get("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await RecursoController.listarRecursos(req, res);
});

router.get("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await RecursoController.visualizarRecursoPorId(req, res);
});

router.put("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await RecursoController.alterarStatusRecurso(req, res);
});

router.get("/candidato/:candidatoId/avaliador/:avaliadorId", authMiddleware, async (req: Request, res: Response) => {
    await RecursoController.listarQuesitosAvaliados(req, res);
});

export default router;