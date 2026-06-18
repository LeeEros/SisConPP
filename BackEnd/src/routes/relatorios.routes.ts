import express, { Request, Response } from "express";
import RelatoriosController from "../controllers/relatorios.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import relatoriosController from "../controllers/relatorios.controller";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get( "/relatorio-geral/:concursoId", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req:Request, res: Response) => {
 await relatoriosController.relatorioGeralPorConcurso(req, res);
});

router.get( "/ranking/:concursoId/:categoriaId", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
        await relatoriosController.rankingPorCategoria(req, res);
});

router.get( "/individual/:candidatoId", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
        await relatoriosController.relatorioIndividualDetalhado(req, res);
});

router.get( "/relatorioDetalhado/:categoriaId/:concursoIdConcurso/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
        await relatoriosController.gerarRelatorioPorCategoriaConcurso(req, res);
});


export default router;
