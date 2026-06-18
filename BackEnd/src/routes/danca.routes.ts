import express, { Request, Response } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware";
import dancaController from '../controllers/danca.controller';
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/dancasTradicionais", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async(req: Request, res: Response) =>{
    await dancaController.listarDancasTradicionais(req, res);
});

router.get("/dancasSalao", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async(req: Request, res: Response) =>{
    await dancaController.listarDancasSalao(req, res);
});

router.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async(req: Request, res: Response) =>{
    await dancaController.criarDanca(req, res);
});

router.put("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async(req: Request, res: Response) =>{
    await dancaController.atualizarDanca(req,res);
});

router.delete("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async(req: Request, res: Response) =>{
    await dancaController.deletarDanca(req,res);
});

export default router;