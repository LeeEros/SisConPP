import express, { Request, Response } from "express";
import comissaoController from "../controllers/comissao.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/avaliador", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.adicionarAvaliadorComissao(req, res);
});

router.post("/auxiliar", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.adicionarAuxiliarComissao(req, res);
});

router.get("/usuarios", authMiddleware,  permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.listarUsuariosComissao(req, res);
});

router.delete("/usuario/:usuarioId/:comissaoId", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.deletarUsuarioComissao(req, res);
});

router.post("/atribuir", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) =>{
    await comissaoController.atribuiacaoAvaliacao(req,res);
});

router.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.criarComissao(req, res);
});

router.put("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.atualizarComissao(req, res);
});

router.get("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.buscarComissaoPorId(req, res);
});

router.get("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.buscarTodasComissoes(req, res);
});

router.delete("/:id", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await comissaoController.deletarComissao(req, res);
});

export default router;
