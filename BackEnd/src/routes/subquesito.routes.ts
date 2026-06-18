import express, { Request, Response } from 'express';
import subquesitoController from '../controllers/subquesito.controller';
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post('/', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await subquesitoController.criarsubQuesitos(req, res);
});

router.put('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await subquesitoController.atualizarsubQuesitos(req, res);
});

router.get('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await subquesitoController.buscarSubQuesitoPorId(req, res);
});

router.get('/', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await subquesitoController.buscarSubQuesitos(req, res);
});

router.delete('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await subquesitoController.deletarSubQuesito(req, res);
});


export default router;