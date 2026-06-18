import express, { Request, Response } from 'express';
import CTGController from '../controllers/ctg.controller';
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post('/', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await CTGController.criarCTG(req, res);
});

router.put('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await CTGController.atualizarCTG(req, res);
});

router.get('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await CTGController.buscarCTGPorId(req, res);
});

router.get('/', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await CTGController.buscarCTGs(req, res);
});

router.delete('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await CTGController.deletarCTG(req, res);
});

export default router;