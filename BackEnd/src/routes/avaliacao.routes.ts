import express, { Request, Response } from "express";
import avaliacaoController from "../controllers/avaliacao.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/avaliacaoCompleta", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AVALIADOR"]), async (req: Request, res: Response) => {
    await avaliacaoController.criarAvaliacaoCompleta(req, res);
});

router.post("/avaliacaoTeorica", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AVALIADOR"]), async (req: Request, res: Response) => {
    await avaliacaoController.criarAvaliacaoTeorica(req, res);
});

router.get("/avaliacao/:idAvaliacao", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AVALIADOR"]), async (req: Request, res: Response) => {
    await avaliacaoController.visualizarAvaliacoes(req, res);
});

router.put("/avaliacao/:idAvaliacao", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AVALIADOR"]), async (req: Request, res: Response) => {
    await avaliacaoController.editarAvaliacao(req, res);
});

router.get( "/avaliacao/:avaliadorId/:candidatoId", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AVALIADOR"]), async (req: Request, res: Response) => {
    await avaliacaoController.buscarEstruturaCompleta(req, res);
});

router.get("/avaliacaoCompleta/:candidatoId/:avaliadorId", async (req: Request, res: Response) => {
    await avaliacaoController.listarAvaliacoesCompletasPorCandidatoAvaliador(req, res);
    console.log("Rota de avaliação completa chamada");
});

router.put("/avaliacaoCompleta/:idAvalicao", async (req: Request, res: Response) => {
    await avaliacaoController.editarAvaliacaoCompleta(req, res);
});

router.get( "/avaliacaoTeorica/:candidatoId", async (req: Request, res: Response) => {
    await avaliacaoController.buscarEstruturaTeorica(req, res);
});

router.get("/avaliacoes", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AVALIADOR", "AUXILIAR"]), async (req: Request, res: Response) => {
    await avaliacaoController.listarAvaliacoes(req, res);
});

export default router;